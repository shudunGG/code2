package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class QueryService {
    private static final Logger logger = Logger.getLogger(QueryService.class.getName());
    
    @Autowired
    @Qualifier("primaryJdbcTemplate")
    private JdbcTemplate primaryJdbcTemplate;
    
    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate secondaryJdbcTemplate;
    
    @Autowired
    private DataSourceService dataSourceService;
    
    @Autowired
    private TableService tableService;
    
    /**
     * 执行自定义SQL查询（安全版本，使用参数化查询）
     * @param sql SQL语句
     * @param params 参数列表
     * @return 查询结果
     */
    public List<Map<String, Object>> executeCustomSQL(String sql, Object... params) {
        try {
            // 验证SQL语句安全性
            validateSQL(sql);
            
            // 提取表名以选择合适的数据源
            String tableName = extractTableNameFromSQL(sql);
            JdbcTemplate targetTemplate = dataSourceService.selectDataSource(tableName);
            
            logger.info("执行SQL查询: " + sql);
            List<Map<String, Object>> result = targetTemplate.queryForList(sql, params);
            logger.info("查询成功，返回 " + result.size() + " 条记录");
            return result;
        } catch (Exception e) {
            logger.severe("自定义SQL执行失败: " + e.getMessage());
            throw new RuntimeException("自定义SQL执行失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 执行自定义SQL查询（兼容旧版本，存在安全风险）
     * @deprecated 请使用 executeCustomSQL(String sql, Object... params) 方法
     * @param sql SQL语句
     * @return 查询结果
     */
    @Deprecated
    public List<Map<String, Object>> executeCustomSQLUnsafe(String sql) {
        try {
            // 提取表名以选择合适的数据源
            String tableName = extractTableNameFromSQL(sql);
            
            if (tableName != null) {
                // 检查表在哪个数据源中存在
                boolean existsInPrimary = tableService.tableExists(tableName, "dbreturn", primaryJdbcTemplate);
                boolean existsInSecondary = tableService.tableExists(tableName, "dboriginal", secondaryJdbcTemplate);
                
                JdbcTemplate targetTemplate;
                String dataSourceName;
                
                if (existsInPrimary && !existsInSecondary) {
                    targetTemplate = primaryJdbcTemplate;
                    dataSourceName = "主数据源(dbreturn)";
                } else if (!existsInPrimary && existsInSecondary) {
                    targetTemplate = secondaryJdbcTemplate;
                    dataSourceName = "辅助数据源(dboriginal)";
                } else if (existsInPrimary && existsInSecondary) {
                    targetTemplate = primaryJdbcTemplate;
                    dataSourceName = "主数据源(dbreturn)";
                    logger.info("表 " + tableName + " 在两个数据源中都存在，优先使用主数据源");
                } else {
                    targetTemplate = primaryJdbcTemplate;
                    dataSourceName = "主数据源(dbreturn)";
                    logger.warning("表 " + tableName + " 在两个数据源中都不存在，使用主数据源尝试执行");
                }
                
                logger.info("选择 " + dataSourceName + " 执行SQL查询");
                List<Map<String, Object>> result = targetTemplate.queryForList(sql);
                logger.info(dataSourceName + "执行成功，返回 " + result.size() + " 条记录");
                return result;
            } else {
                // 如果无法提取表名，按原来的逻辑执行（先主后辅）
                logger.warning("无法从SQL中提取表名，使用原有逻辑执行");
                try {
                    List<Map<String, Object>> result = primaryJdbcTemplate.queryForList(sql);
                    logger.info("主数据源执行成功，返回 " + result.size() + " 条记录");
                    return result;
                } catch (Exception e) {
                    logger.warning("主数据源执行失败: " + e.getMessage() + "，尝试辅助数据源");
                    List<Map<String, Object>> result = secondaryJdbcTemplate.queryForList(sql);
                    logger.info("辅助数据源执行成功，返回 " + result.size() + " 条记录");
                    return result;
                }
            }
        } catch (Exception e) {
            logger.severe("自定义SQL执行失败: " + e.getMessage());
            throw new RuntimeException("自定义SQL执行失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 获取表格数据（分页）- 安全版本，使用参数化查询
     * @param tableName 表名
     * @param page 页码
     * @param size 每页大小
     * @return 分页数据
     */
    public Map<String, Object> getTableData(String tableName, int page, int size) {
        try {
            // 清理表名
            tableName = cleanTableName(tableName);
            String cleanTableName = sanitizeTableName(tableName);
            
            // 计算偏移量
            int offset = (page - 1) * size;
            
            // 选择数据源
            JdbcTemplate targetTemplate = dataSourceService.selectDataSource(tableName);
            
            // 使用安全的SQL查询 - 表名已经过验证，可以安全拼接
            // 注意：MySQL的表名不能作为参数传递，但已经过严格验证
            String countSql = "SELECT COUNT(*) FROM " + cleanTableName;
            String dataSql = "SELECT * FROM " + cleanTableName + " LIMIT ? OFFSET ?";
            
            // 获取总记录数
            Integer totalCount = targetTemplate.queryForObject(countSql, Integer.class);
            
            // 获取分页数据 - 使用参数化查询传递LIMIT和OFFSET参数
            List<Map<String, Object>> data = targetTemplate.queryForList(dataSql, size, offset);
            
            // 构建返回结果
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("data", data);
            result.put("total", totalCount != null ? totalCount : 0);
            result.put("page", page);
            result.put("size", size);
            result.put("totalPages", totalCount != null ? (int) Math.ceil((double) totalCount / size) : 0);
            
            return result;
        } catch (Exception e) {
            logger.severe("获取表格数据失败: " + e.getMessage());
            throw new RuntimeException("获取表格数据失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 从SQL语句中提取表名
     * @param sql SQL语句
     * @return 表名
     */
    private String extractTableNameFromSQL(String sql) {
        try {
            // 使用正则表达式提取FROM子句中的表名
            Pattern pattern = Pattern.compile("\\bFROM\\s+([`\"\\[]?)(\\w+)([`\"\\]]?)\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(sql);
            
            if (matcher.find()) {
                String tableName = matcher.group(2);
                logger.info("从SQL中提取的表名: " + tableName);
                return tableName;
            }
            
            logger.warning("无法从SQL中提取表名: " + sql);
            return null;
        } catch (Exception e) {
            logger.warning("提取表名失败: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * 清理表名，移除空白字符
     * @param tableName 原始表名
     * @return 清理后的表名
     */
    private String cleanTableName(String tableName) {
        return tableName.trim()
                .replaceAll("[\\s\\u00A0\\u2000-\\u200F\\u2028\\u2029]+", "")
                .replaceAll("\\p{Z}+", "");
    }
    
    /**
     * 验证SQL语句安全性
     * @param sql SQL语句
     * @throws IllegalArgumentException 如果SQL不安全
     */
    private void validateSQL(String sql) {
        if (sql == null || sql.trim().isEmpty()) {
            throw new IllegalArgumentException("SQL语句不能为空");
        }
        
        String upperSql = sql.toUpperCase().trim();
        
        // 检查是否为SELECT语句
        if (!upperSql.startsWith("SELECT")) {
            throw new IllegalArgumentException("只允许执行SELECT查询");
        }
        
        // 检查危险关键词
        String[] dangerousKeywords = {
            "DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE", "TRUNCATE",
            "EXEC", "EXECUTE", "UNION", "--", "/*", "*/", "XP_", "SP_"
        };
        
        for (String keyword : dangerousKeywords) {
            if (upperSql.contains(keyword)) {
                throw new IllegalArgumentException("SQL语句包含不允许的关键词: " + keyword);
            }
        }
    }
    
    /**
     * 执行结构化查询（安全版本）
     * @param tableName 表名
     * @param fields 查询字段列表
     * @param conditions 查询条件列表
     * @param limit 限制条数
     * @return 查询结果
     */
    @Cacheable(value = "queryResults", key = "#tableName + '_' + #fields.toString() + '_' + #conditions.toString() + '_' + #limit")
    public List<Map<String, Object>> executeStructuredQuery(String tableName, List<String> fields, 
                                                           List<Map<String, Object>> conditions, Integer limit) {
        try {
            // 清理表名
            String cleanTableName = sanitizeTableName(tableName);
            
            // 清理字段名
            List<String> cleanFields = new ArrayList<>();
            for (String field : fields) {
                if (field.matches("^[a-zA-Z0-9_]+$")) {
                    cleanFields.add(field);
                } else {
                    throw new IllegalArgumentException("字段名包含非法字符: " + field);
                }
            }
            
            // 构建SQL语句
            StringBuilder sqlBuilder = new StringBuilder();
            sqlBuilder.append("SELECT ");
            sqlBuilder.append(String.join(", ", cleanFields));
            sqlBuilder.append(" FROM ").append(cleanTableName);
            
            // 构建WHERE条件和参数列表
            List<Object> params = new ArrayList<>();
            if (conditions != null && !conditions.isEmpty()) {
                sqlBuilder.append(" WHERE ");
                
                for (int i = 0; i < conditions.size(); i++) {
                    Map<String, Object> condition = conditions.get(i);
                    String field = (String) condition.get("field");
                    String operator = (String) condition.get("operator");
                    Object value = condition.get("value");
                    String logic = (String) condition.get("logic");
                    
                    // 验证字段名
                    if (!field.matches("^[a-zA-Z0-9_]+$")) {
                        throw new IllegalArgumentException("条件字段名包含非法字符: " + field);
                    }
                    
                    // 验证操作符
                    if (!isValidOperator(operator)) {
                        throw new IllegalArgumentException("不支持的操作符: " + operator);
                    }
                    
                    if (i > 0) {
                        String logicOp = (logic != null && logic.equalsIgnoreCase("OR")) ? " OR " : " AND ";
                        sqlBuilder.append(logicOp);
                    }
                    
                    sqlBuilder.append(field).append(" ").append(operator);
                    
                    if ("IS NULL".equalsIgnoreCase(operator) || "IS NOT NULL".equalsIgnoreCase(operator)) {
                        // 这些操作符不需要参数
                    } else {
                        sqlBuilder.append(" ?");
                        if ("LIKE".equalsIgnoreCase(operator)) {
                            params.add("%" + value + "%");
                        } else {
                            params.add(value);
                        }
                    }
                }
            }
            
            // 添加LIMIT
            if (limit != null && limit > 0) {
                sqlBuilder.append(" LIMIT ?");
                params.add(limit);
            }
            
            String sql = sqlBuilder.toString();
            logger.info("执行结构化查询: " + sql);
            
            // 选择数据源并执行查询
            JdbcTemplate targetTemplate = dataSourceService.selectDataSource(cleanTableName);
            List<Map<String, Object>> result = targetTemplate.queryForList(sql, params.toArray());
            
            logger.info("结构化查询成功，返回 " + result.size() + " 条记录");
            return result;
            
        } catch (Exception e) {
            logger.severe("结构化查询执行失败: " + e.getMessage());
            throw new RuntimeException("结构化查询执行失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 验证操作符是否合法
     * @param operator 操作符
     * @return 是否合法
     */
    private boolean isValidOperator(String operator) {
        String[] validOperators = {"=", "!=", "<>", "<", ">", "<=", ">=", "LIKE", "IS NULL", "IS NOT NULL"};
        for (String validOp : validOperators) {
            if (validOp.equalsIgnoreCase(operator)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 清理表名以防止SQL注入
     * @param tableName 表名
     * @return 清理后的表名
     */
    private String sanitizeTableName(String tableName) {
        // 只允许字母、数字、下划线
        if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("表名包含非法字符: " + tableName);
        }
        return tableName;
    }
}
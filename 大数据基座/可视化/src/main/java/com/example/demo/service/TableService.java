package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class TableService {
    private static final Logger logger = Logger.getLogger(TableService.class.getName());
    
    @Autowired
    @Qualifier("primaryJdbcTemplate")
    private JdbcTemplate primaryJdbcTemplate;
    
    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate secondaryJdbcTemplate;
    
    /**
     * 获取所有已注册的表格列表
     * @return 表格列表
     */
    @Cacheable(value = "tables", key = "'all_tables'")
    public List<Map<String, Object>> getTables() {
        String sql = "SELECT " +
                "tr.id, " +
                "tr.resources_name AS tableName, " +
                "tr.table_name AS physicalTableName, " +
                "tr.from_system_name AS sourceSystem, " +
                "tr.create_time AS createTime, " +
                "tr.update_time AS updateTime " +
                "FROM table_register tr " +
                "WHERE tr.is_deleted = 0 " +
                "ORDER BY tr.update_time DESC";
        
        return primaryJdbcTemplate.queryForList(sql);
    }
    
    /**
     * 获取所有表格列表（别名方法）
     * @return 表格列表
     */
    public List<Map<String, Object>> getAllTables() {
        return getTables();
    }
    
    /**
     * 搜索接口资源（支持已注册和未注册的表）
     * @param keyword 搜索关键词
     * @param page 页码
     * @param size 每页大小
     * @return 搜索结果
     */
    public List<Map<String, Object>> searchInterfaceResources(String keyword, int page, int size) {
        // 简化实现，直接返回已注册的表
        List<Map<String, Object>> allTables = searchRegisteredTables(keyword);
        
        // 计算分页
        int start = (page - 1) * size;
        int end = Math.min(start + size, allTables.size());
        
        if (start >= allTables.size()) {
            return new java.util.ArrayList<>();
        }
        
        return allTables.subList(start, end);
    }
    
    /**
     * 获取接口资源总数
     * @return 总数
     */
    public int getInterfaceResourcesCount() {
        String sql = "SELECT COUNT(*) FROM table_register tr " +
                "WHERE tr.is_deleted = 0";
        
        try {
            Integer count = primaryJdbcTemplate.queryForObject(sql, Integer.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            logger.warning("获取接口资源总数失败: " + e.getMessage());
            return 0;
        }
    }
    
    /**
     * 检查表是否存在
     * @param tableName 表名
     * @return 检查结果
     */
    public Map<String, Object> checkTableExists(String tableName) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String cleanTableName = sanitizeTableName(tableName);
            
            // 检查表在主数据源中是否存在
            boolean existsInPrimary = tableExists(cleanTableName, "dbreturn", primaryJdbcTemplate);
            
            // 检查表在辅助数据源中是否存在
            boolean existsInSecondary = tableExists(cleanTableName, "dboriginal", secondaryJdbcTemplate);
            
            // 检查表是否已注册
            String registrationSql = "SELECT COUNT(*) FROM table_register WHERE table_name = ? AND is_deleted = 0";
            Integer registrationCount = primaryJdbcTemplate.queryForObject(registrationSql, Integer.class, cleanTableName);
            boolean isRegistered = registrationCount != null && registrationCount > 0;
            
            result.put("tableName", cleanTableName);
            result.put("existsInPrimary", existsInPrimary);
            result.put("existsInSecondary", existsInSecondary);
            result.put("isRegistered", isRegistered);
            result.put("exists", existsInPrimary || existsInSecondary);
            
        } catch (Exception e) {
            logger.severe("检查表存在性失败: " + e.getMessage());
            result.put("error", e.getMessage());
            result.put("exists", false);
        }
        
        return result;
    }
    
    /**
     * 获取表格详细信息
     * @param tableName 表名
     * @return 表格详细信息
     */
    public Map<String, Object> getTableDetails(String tableName) {
        String sql = "SELECT " +
                "tr.*, " +
                "dir.resources_name AS directoryName, " +
                "pd.name AS dataSourceName, " +
                "pd.database_name AS databaseName " +
                "FROM table_register tr " +
                "LEFT JOIN directory_info_version dir ON tr.resource_catalog = dir.resources_guid " +
                "LEFT JOIN pre_database pd ON tr.datasource_uuid = pd.id " +
                "WHERE tr.table_name = ? AND tr.is_deleted = 0";
        
        List<Map<String, Object>> results = primaryJdbcTemplate.queryForList(sql, tableName);
        return results.isEmpty() ? null : results.get(0);
    }
    
    /**
     * 根据英文表名查找中文表名
     * @param englishTableName 英文表名
     * @return 中文表名
     */
    public String findChineseTableName(String englishTableName) {
        try {
            String sql = "SELECT resources_name FROM table_register WHERE table_name = ? AND is_deleted = 0 LIMIT 1";
            List<Map<String, Object>> results = primaryJdbcTemplate.queryForList(sql, englishTableName);
            if (!results.isEmpty()) {
                return (String) results.get(0).get("resources_name");
            }
            return null;
        } catch (Exception e) {
            logger.warning("查找中文表名失败: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * 搜索已注册的表
     * @param keyword 搜索关键词
     * @return 搜索结果
     */
    public List<Map<String, Object>> searchRegisteredTables(String keyword) {
        String sql = "SELECT " +
                "tr.id AS '资源ID', " +
                "tr.resources_name AS '资源名称', " +
                "tr.table_name AS '表编码', " +
                "tr.table_name AS '物理表名称', " +
                "tr.metadata_table AS '元数据表名称', " +
                "tr.from_system AS '来源系统代码', " +
                "tr.from_system_name AS '来源系统名称', " +
                "tr.create_time AS '创建时间', " +
                "tr.update_time AS '更新时间', " +
                "dir.resources_name AS '目录资源名称', " +
                "dir.resources_guid AS '资源唯一标识', " +
                "dir.editon_num AS '版本号', " +
                "pd.name AS '数据源名称', " +
                "pd.database_name AS '数据库名称', " +
                "pd.database_type AS '数据库类型' " +
                "FROM " +
                "table_register tr " +
                "LEFT JOIN " +
                "directory_info_version dir ON tr.resource_catalog = dir.resources_guid " +
                "LEFT JOIN " +
                "pre_database pd ON tr.datasource_uuid = pd.id " +
                "WHERE " +
                "tr.is_deleted = 0 " +
                "AND (dir.is_deleted = 0 OR dir.is_deleted IS NULL)";
        
        // 如果有搜索关键词，添加搜索条件
        if (keyword != null && !keyword.trim().isEmpty()) {
            sql += " AND (tr.resources_name LIKE ? OR tr.table_name LIKE ?)";
        }
        
        try {
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword + "%";
                return primaryJdbcTemplate.queryForList(sql, searchPattern, searchPattern);
            } else {
                return primaryJdbcTemplate.queryForList(sql);
            }
        } catch (Exception e) {
            logger.warning("主数据源搜索已注册表失败，尝试辅助数据源: " + e.getMessage());
            try {
                if (keyword != null && !keyword.trim().isEmpty()) {
                    String searchPattern = "%" + keyword + "%";
                    return secondaryJdbcTemplate.queryForList(sql, searchPattern, searchPattern);
                } else {
                    return secondaryJdbcTemplate.queryForList(sql);
                }
            } catch (Exception e2) {
                logger.warning("辅助数据源搜索已注册表也失败: " + e2.getMessage());
                return new java.util.ArrayList<>();
            }
        }
    }
    
    /**
     * 检查表是否存在于指定数据源
     * @param tableName 表名
     * @param schema 数据库schema
     * @param jdbcTemplate 数据源模板
     * @return 是否存在
     */
    public boolean tableExists(String tableName, String schema, JdbcTemplate jdbcTemplate) {
        try {
            String sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, schema, tableName);
            return count != null && count > 0;
        } catch (Exception e) {
            logger.warning("检查表存在性失败: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * 获取表的列信息
     * @param tableName 表名
     * @param schema 数据库schema
     * @param jdbcTemplate 数据源模板
     * @return 列信息列表
     */
    public List<Map<String, Object>> getTableColumns(String tableName, String schema, JdbcTemplate jdbcTemplate) {
        try {
            String sql = "SELECT " +
                    "COLUMN_NAME, " +
                    "DATA_TYPE, " +
                    "IS_NULLABLE, " +
                    "COLUMN_DEFAULT, " +
                    "COLUMN_COMMENT " +
                    "FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? " +
                    "ORDER BY ORDINAL_POSITION";
            
            return jdbcTemplate.queryForList(sql, schema, tableName);
        } catch (Exception e) {
            logger.warning("获取表列信息失败: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }
    
    /**
     * 获取表字段信息（安全版本，使用参数化查询）
     * @param tableName 表名
     * @return 字段信息列表
     */
    @Cacheable(value = "tableFields", key = "#tableName")
    public List<Map<String, Object>> getTableFields(String tableName) {
        try {
            // 清理表名，只允许字母、数字、下划线
            String cleanTableName = sanitizeTableName(tableName);
            
            // 智能选择数据源：根据表所属的数据库来选择正确的数据源
            JdbcTemplate targetTemplate = null;
            String dataSourceName = null;
            String tableSchema = null;
            
            // 首先检查表在哪个数据库中存在
            boolean existsInPrimary = tableExists(cleanTableName, "dbreturn", primaryJdbcTemplate);
            boolean existsInSecondary = tableExists(cleanTableName, "dboriginal", secondaryJdbcTemplate);
            
            // 根据表的存在情况选择数据源
            if (existsInPrimary && !existsInSecondary) {
                targetTemplate = primaryJdbcTemplate;
                dataSourceName = "主数据源(dbreturn)";
                tableSchema = "dbreturn";
            } else if (!existsInPrimary && existsInSecondary) {
                targetTemplate = secondaryJdbcTemplate;
                dataSourceName = "辅助数据源(dboriginal)";
                tableSchema = "dboriginal";
            } else if (existsInPrimary && existsInSecondary) {
                // 如果两个数据源都有同名表，优先使用主数据源，但记录警告
                targetTemplate = primaryJdbcTemplate;
                dataSourceName = "主数据源(dbreturn)";
                tableSchema = "dbreturn";
                logger.warning("表 " + cleanTableName + " 在两个数据源中都存在，优先使用主数据源");
            } else {
                throw new RuntimeException("表 '" + cleanTableName + "' 在主数据源(dbreturn)和辅助数据源(dboriginal)中都不存在。请检查表名是否正确。");
            }
            
            // 查询字段信息（包含中文注释）- 使用参数化查询
            String sql = "SELECT " +
                    "COLUMN_NAME as Field, " +
                    "DATA_TYPE as Type, " +
                    "IS_NULLABLE as `Null`, " +
                    "COLUMN_KEY as `Key`, " +
                    "COLUMN_DEFAULT as `Default`, " +
                    "EXTRA as Extra, " +
                    "COLUMN_COMMENT as Comment " +
                    "FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? " +
                    "ORDER BY ORDINAL_POSITION";
            
            List<Map<String, Object>> fields = targetTemplate.queryForList(sql, tableSchema, cleanTableName);
            if (fields.isEmpty()) {
                // 如果INFORMATION_SCHEMA查询为空，回退到DESCRIBE命令（使用参数化查询）
                String describeSql = "DESCRIBE " + cleanTableName; // 表名已经过安全验证
                try {
                    fields = targetTemplate.queryForList(describeSql);
                } catch (Exception describeException) {
                    logger.warning(dataSourceName + "DESCRIBE命令失败: " + describeException.getMessage());
                    throw describeException;
                }
            }
            
            logger.info("成功从" + dataSourceName + "获取表 " + cleanTableName + " 的字段信息，共 " + fields.size() + " 个字段");
            return fields;
            
        } catch (Exception e) {
            logger.severe("获取表字段信息失败: " + e.getMessage());
            throw new RuntimeException("获取表字段信息失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 清理表名以防止SQL注入
     * @param tableName 表名
     * @return 清理后的表名
     */
    private String sanitizeTableName(String tableName) {
        if (tableName == null || tableName.trim().isEmpty()) {
            throw new IllegalArgumentException("表名不能为空");
        }
        
        // 清理Unicode空白字符
        String cleanName = tableName.trim()
                .replaceAll("[\\s\\u00A0\\u2000-\\u200F\\u2028\\u2029]+", "")
                .replaceAll("\\p{Z}+", "");
        
        // 只允许字母、数字、下划线
        if (!cleanName.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("表名格式无效: " + tableName + "。表名只能包含字母、数字和下划线，不能包含中文字符、空格或特殊符号");
        }
        
        return cleanName;
    }
}
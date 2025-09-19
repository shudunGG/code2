package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class DataSourceService {
    private static final Logger logger = Logger.getLogger(DataSourceService.class.getName());
    
    @Autowired
    @Qualifier("primaryJdbcTemplate")
    private JdbcTemplate primaryJdbcTemplate;
    
    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate secondaryJdbcTemplate;
    
    @Autowired
    private TableService tableService;
    
    private static final String PRIMARY_SCHEMA = "dbreturn";
    private static final String SECONDARY_SCHEMA = "dboriginal";
    
    /**
     * 根据表名选择合适的数据源
     * @param tableName 表名
     * @return 选择的JdbcTemplate
     */
    public JdbcTemplate selectDataSource(String tableName) {
        if (tableName == null || tableName.trim().isEmpty()) {
            logger.info("表名为空，使用主数据源");
            return primaryJdbcTemplate;
        }
        
        // 检查表在哪个数据源中存在
        boolean existsInPrimary = tableService.tableExists(tableName, PRIMARY_SCHEMA, primaryJdbcTemplate);
        boolean existsInSecondary = tableService.tableExists(tableName, SECONDARY_SCHEMA, secondaryJdbcTemplate);
        
        if (existsInPrimary && !existsInSecondary) {
            logger.info("表 " + tableName + " 存在于主数据源，选择主数据源");
            return primaryJdbcTemplate;
        } else if (!existsInPrimary && existsInSecondary) {
            logger.info("表 " + tableName + " 存在于辅助数据源，选择辅助数据源");
            return secondaryJdbcTemplate;
        } else if (existsInPrimary && existsInSecondary) {
            logger.info("表 " + tableName + " 在两个数据源中都存在，优先使用主数据源");
            return primaryJdbcTemplate;
        } else {
            logger.warning("表 " + tableName + " 在两个数据源中都不存在，默认使用主数据源");
            return primaryJdbcTemplate;
        }
    }
    
    /**
     * 获取所有数据库表（从两个数据源）
     * @return 所有表的列表
     */
    public List<Map<String, Object>> getAllDatabaseTables() {
        List<Map<String, Object>> allTables = new java.util.ArrayList<>();
        
        // 从主数据源获取表
        try {
            String primarySql = "SELECT " +
                    "TABLE_NAME, " +
                    "TABLE_SCHEMA, " +
                    "CREATE_TIME, " +
                    "TABLE_COMMENT " +
                    "FROM INFORMATION_SCHEMA.TABLES " +
                    "WHERE TABLE_SCHEMA = ? " +
                    "AND TABLE_TYPE = 'BASE TABLE' " +
                    "ORDER BY TABLE_NAME";
            
            List<Map<String, Object>> primaryTables = primaryJdbcTemplate.queryForList(primarySql, PRIMARY_SCHEMA);
            allTables.addAll(primaryTables);
            logger.info("从主数据源获取到 " + primaryTables.size() + " 个表");
        } catch (Exception e) {
            logger.warning("从主数据源获取表列表失败: " + e.getMessage());
        }
        
        // 从辅助数据源获取表
        try {
            String secondarySql = "SELECT " +
                    "TABLE_NAME, " +
                    "TABLE_SCHEMA, " +
                    "CREATE_TIME, " +
                    "TABLE_COMMENT " +
                    "FROM INFORMATION_SCHEMA.TABLES " +
                    "WHERE TABLE_SCHEMA = ? " +
                    "AND TABLE_TYPE = 'BASE TABLE' " +
                    "ORDER BY TABLE_NAME";
            
            List<Map<String, Object>> secondaryTables = secondaryJdbcTemplate.queryForList(secondarySql, SECONDARY_SCHEMA);
            allTables.addAll(secondaryTables);
            logger.info("从辅助数据源获取到 " + secondaryTables.size() + " 个表");
        } catch (Exception e) {
            logger.warning("从辅助数据源获取表列表失败: " + e.getMessage());
        }
        
        return allTables;
    }
    
    /**
     * 测试数据源连接
     * @param jdbcTemplate 要测试的数据源
     * @param dataSourceName 数据源名称
     * @return 连接是否正常
     */
    public boolean testConnection(JdbcTemplate jdbcTemplate, String dataSourceName) {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            logger.info(dataSourceName + " 连接正常");
            return true;
        } catch (Exception e) {
            logger.warning(dataSourceName + " 连接失败: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * 获取数据源状态信息
     * @return 数据源状态
     */
    public Map<String, Object> getDataSourceStatus() {
        Map<String, Object> status = new java.util.HashMap<>();
        
        // 测试主数据源
        boolean primaryStatus = testConnection(primaryJdbcTemplate, "主数据源");
        Map<String, Object> primaryInfo = new java.util.HashMap<>();
        primaryInfo.put("name", "主数据源(" + PRIMARY_SCHEMA + ")");
        primaryInfo.put("status", primaryStatus ? "正常" : "异常");
        primaryInfo.put("schema", PRIMARY_SCHEMA);
        status.put("primary", primaryInfo);
        
        // 测试辅助数据源
        boolean secondaryStatus = testConnection(secondaryJdbcTemplate, "辅助数据源");
        Map<String, Object> secondaryInfo = new java.util.HashMap<>();
        secondaryInfo.put("name", "辅助数据源(" + SECONDARY_SCHEMA + ")");
        secondaryInfo.put("status", secondaryStatus ? "正常" : "异常");
        secondaryInfo.put("schema", SECONDARY_SCHEMA);
        status.put("secondary", secondaryInfo);
        
        status.put("overall", primaryStatus && secondaryStatus ? "正常" : "部分异常");
        
        return status;
    }
    
    /**
     * 执行查询并自动选择数据源（带重试机制）
     * @param sql SQL语句
     * @param params 参数
     * @return 查询结果
     */
    public List<Map<String, Object>> executeWithFallback(String sql, Object... params) {
        try {
            // 首先尝试主数据源
            List<Map<String, Object>> result = primaryJdbcTemplate.queryForList(sql, params);
            logger.info("主数据源执行成功，返回 " + result.size() + " 条记录");
            return result;
        } catch (Exception e) {
            logger.warning("主数据源执行失败: " + e.getMessage() + "，尝试辅助数据源");
            try {
                List<Map<String, Object>> result = secondaryJdbcTemplate.queryForList(sql, params);
                logger.info("辅助数据源执行成功，返回 " + result.size() + " 条记录");
                return result;
            } catch (Exception e2) {
                logger.severe("两个数据源都执行失败: " + e2.getMessage());
                throw new RuntimeException("数据源执行失败", e2);
            }
        }
    }
    
    /**
     * 获取主数据源
     * @return 主数据源JdbcTemplate
     */
    public JdbcTemplate getPrimaryJdbcTemplate() {
        return primaryJdbcTemplate;
    }
    
    /**
     * 获取辅助数据源
     * @return 辅助数据源JdbcTemplate
     */
    public JdbcTemplate getSecondaryJdbcTemplate() {
        return secondaryJdbcTemplate;
    }
    
    /**
     * 获取主数据库schema名称
     * @return schema名称
     */
    public String getPrimarySchema() {
        return PRIMARY_SCHEMA;
    }
    
    /**
     * 获取辅助数据库schema名称
     * @return schema名称
     */
    public String getSecondarySchema() {
        return SECONDARY_SCHEMA;
    }
}
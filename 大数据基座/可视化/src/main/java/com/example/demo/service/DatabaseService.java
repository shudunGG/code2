package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class DatabaseService {
    private static final Logger logger = Logger.getLogger(DatabaseService.class.getName());
    
    @Autowired
    private TableService tableService;
    
    @Autowired
    private QueryService queryService;
    
    @Autowired
    private DataSourceService dataSourceService;
    
    @Autowired
    private CacheService cacheService;
    
    @Autowired
    @Qualifier("primaryJdbcTemplate")
    private JdbcTemplate primaryJdbcTemplate;
    
    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate secondaryJdbcTemplate;
    
    // 保持向后兼容性，默认使用主数据源
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // 获取所有表格列表
    public List<Map<String, Object>> getTables() {
        return tableService.getAllTables();
    }
    
    // 搜索接口资源（支持已注册和未注册的表）
    public Map<String, Object> searchInterfaceResources(String keyword, int page, int size) {
        List<Map<String, Object>> data = tableService.searchInterfaceResources(keyword, page, size);
        long totalCount = tableService.getInterfaceResourcesCount();
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", data);
        result.put("totalCount", totalCount);
        return result;
    }
    
    // 搜索已注册的表（已委托给TableService，此方法已废弃）
    @Deprecated
    private List<Map<String, Object>> searchRegisteredTables(String keyword) {
        // 此方法已迁移到TableService，直接委托调用
        return tableService.searchRegisteredTables(keyword);
    }
    
    // 获取表格详细信息
    public Map<String, Object> getTableDetails(String tableName) {
        return tableService.getTableDetails(tableName);
    }
    
    // 根据英文表名查找中文表名
    public String findChineseTableName(String englishTableName) {
        return tableService.findChineseTableName(englishTableName);
    }
    
    // 获取表格数据
    public Map<String, Object> getTableData(String tableName, int page, int size) {
        return queryService.getTableData(tableName, page, size);
    }
    
    @Cacheable(value = "interfaceResources", key = "'page_' + #page + '_size_' + #size")
    public Map<String, Object> getInterfaceResources(int page, int size) {
        List<Map<String, Object>> data = tableService.searchInterfaceResources(null, page, size);
        long totalCount = tableService.getInterfaceResourcesCount();
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", data);
        result.put("totalCount", totalCount);
        return result;
    }
    
    public long getInterfaceResourcesCount() {
        return tableService.getInterfaceResourcesCount();
    }
    
    // 获取表字段信息
    public List<Map<String, Object>> getTableFields(String tableName) {
        return tableService.getTableFields(tableName);
    }
    
    // 检查表是否在数据库中存在
    public Map<String, Object> checkTableExists(String tableName) {
        return tableService.checkTableExists(tableName);
    }
    
    // 执行自定义SQL查询
    public List<Map<String, Object>> executeCustomSQL(String sql) {
        return queryService.executeCustomSQL(sql);
    }
    
}
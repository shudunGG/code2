package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Service
public class CacheService {
    private static final Logger logger = Logger.getLogger(CacheService.class.getName());
    
    // 缓存存储
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    
    // 默认缓存时间（5分钟）
    private static final long DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
    
    // 表列表缓存时间（10分钟）
    private static final long TABLE_LIST_CACHE_DURATION = 10 * 60 * 1000;
    
    // 表详情缓存时间（30分钟）
    private static final long TABLE_DETAILS_CACHE_DURATION = 30 * 60 * 1000;
    
    /**
     * 缓存条目内部类
     */
    private static class CacheEntry {
        private final Object data;
        private final long timestamp;
        private final long duration;
        
        public CacheEntry(Object data, long duration) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
            this.duration = duration;
        }
        
        public boolean isExpired() {
            return System.currentTimeMillis() - timestamp > duration;
        }
        
        public Object getData() {
            return data;
        }
        
        public long getAge() {
            return System.currentTimeMillis() - timestamp;
        }
    }
    
    /**
     * 获取缓存数据
     * @param key 缓存键
     * @return 缓存的数据，如果不存在或已过期则返回null
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry == null) {
            logger.fine("缓存未命中: " + key);
            return null;
        }
        
        if (entry.isExpired()) {
            cache.remove(key);
            logger.fine("缓存已过期: " + key);
            return null;
        }
        
        logger.fine("缓存命中: " + key + "，年龄: " + entry.getAge() + "ms");
        return (T) entry.getData();
    }
    
    /**
     * 存储数据到缓存
     * @param key 缓存键
     * @param data 要缓存的数据
     * @param duration 缓存时间（毫秒）
     */
    public void put(String key, Object data, long duration) {
        if (data == null) {
            logger.warning("尝试缓存null数据: " + key);
            return;
        }
        
        cache.put(key, new CacheEntry(data, duration));
        logger.fine("数据已缓存: " + key + "，缓存时间: " + duration + "ms");
    }
    
    /**
     * 使用默认缓存时间存储数据
     * @param key 缓存键
     * @param data 要缓存的数据
     */
    public void put(String key, Object data) {
        put(key, data, DEFAULT_CACHE_DURATION);
    }
    
    /**
     * 移除缓存
     * @param key 缓存键
     */
    public void remove(String key) {
        cache.remove(key);
        logger.fine("缓存已移除: " + key);
    }
    
    /**
     * 清空所有缓存
     */
    public void clear() {
        int size = cache.size();
        cache.clear();
        logger.info("已清空所有缓存，共 " + size + " 个条目");
    }
    
    /**
     * 清理过期缓存
     */
    public void cleanupExpired() {
        int removedCount = 0;
        for (Map.Entry<String, CacheEntry> entry : cache.entrySet()) {
            if (entry.getValue().isExpired()) {
                cache.remove(entry.getKey());
                removedCount++;
            }
        }
        if (removedCount > 0) {
            logger.info("清理了 " + removedCount + " 个过期缓存条目");
        }
    }
    
    /**
     * 缓存表列表
     * @param keyword 搜索关键词（可为null）
     * @param tables 表列表
     */
    public void cacheTableList(String keyword, List<Map<String, Object>> tables) {
        String key = "tables:" + (keyword != null ? keyword : "all");
        put(key, tables, TABLE_LIST_CACHE_DURATION);
    }
    
    /**
     * 获取缓存的表列表
     * @param keyword 搜索关键词（可为null）
     * @return 缓存的表列表
     */
    public List<Map<String, Object>> getCachedTableList(String keyword) {
        String key = "tables:" + (keyword != null ? keyword : "all");
        return get(key);
    }
    
    /**
     * 缓存表详情
     * @param tableName 表名
     * @param details 表详情
     */
    public void cacheTableDetails(String tableName, Map<String, Object> details) {
        String key = "table_details:" + tableName;
        put(key, details, TABLE_DETAILS_CACHE_DURATION);
    }
    
    /**
     * 获取缓存的表详情
     * @param tableName 表名
     * @return 缓存的表详情
     */
    public Map<String, Object> getCachedTableDetails(String tableName) {
        String key = "table_details:" + tableName;
        return get(key);
    }
    
    /**
     * 缓存表数据
     * @param tableName 表名
     * @param page 页码
     * @param size 每页大小
     * @param data 表数据
     */
    public void cacheTableData(String tableName, int page, int size, Map<String, Object> data) {
        String key = String.format("table_data:%s:%d:%d", tableName, page, size);
        put(key, data, DEFAULT_CACHE_DURATION);
    }
    
    /**
     * 获取缓存的表数据
     * @param tableName 表名
     * @param page 页码
     * @param size 每页大小
     * @return 缓存的表数据
     */
    public Map<String, Object> getCachedTableData(String tableName, int page, int size) {
        String key = String.format("table_data:%s:%d:%d", tableName, page, size);
        return get(key);
    }
    
    /**
     * 缓存查询结果
     * @param sql SQL语句
     * @param params 参数
     * @param result 查询结果
     */
    public void cacheQueryResult(String sql, Object[] params, List<Map<String, Object>> result) {
        String key = "query:" + generateQueryKey(sql, params);
        put(key, result, DEFAULT_CACHE_DURATION);
    }
    
    /**
     * 获取缓存的查询结果
     * @param sql SQL语句
     * @param params 参数
     * @return 缓存的查询结果
     */
    public List<Map<String, Object>> getCachedQueryResult(String sql, Object[] params) {
        String key = "query:" + generateQueryKey(sql, params);
        return get(key);
    }
    
    /**
     * 生成查询缓存键
     * @param sql SQL语句
     * @param params 参数
     * @return 缓存键
     */
    private String generateQueryKey(String sql, Object[] params) {
        StringBuilder keyBuilder = new StringBuilder();
        keyBuilder.append(sql.hashCode());
        
        if (params != null && params.length > 0) {
            for (Object param : params) {
                keyBuilder.append(":").append(param != null ? param.toString() : "null");
            }
        }
        
        return keyBuilder.toString();
    }
    
    /**
     * 使缓存失效（根据前缀）
     * @param prefix 缓存键前缀
     */
    public void invalidateByPrefix(String prefix) {
        int removedCount = 0;
        for (String key : cache.keySet()) {
            if (key.startsWith(prefix)) {
                cache.remove(key);
                removedCount++;
            }
        }
        if (removedCount > 0) {
            logger.info("使 " + removedCount + " 个缓存条目失效（前缀: " + prefix + "）");
        }
    }
    
    /**
     * 获取缓存统计信息
     * @return 缓存统计
     */
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new java.util.HashMap<>();
        
        int totalEntries = cache.size();
        int expiredEntries = 0;
        long totalMemory = 0;
        
        for (CacheEntry entry : cache.values()) {
            if (entry.isExpired()) {
                expiredEntries++;
            }
            // 简单估算内存使用（实际情况会更复杂）
            totalMemory += estimateSize(entry.getData());
        }
        
        stats.put("totalEntries", totalEntries);
        stats.put("activeEntries", totalEntries - expiredEntries);
        stats.put("expiredEntries", expiredEntries);
        stats.put("estimatedMemoryKB", totalMemory / 1024);
        
        return stats;
    }
    
    /**
     * 估算对象大小（简单实现）
     * @param obj 对象
     * @return 估算的字节数
     */
    private long estimateSize(Object obj) {
        if (obj == null) return 0;
        
        if (obj instanceof String) {
            return ((String) obj).length() * 2; // 假设每个字符2字节
        } else if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            return list.size() * 100; // 假设每个元素平均100字节
        } else if (obj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) obj;
            return map.size() * 150; // 假设每个键值对平均150字节
        }
        
        return 50; // 默认估算
    }
}
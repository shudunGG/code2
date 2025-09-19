package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * 缓存管理服务
 * 提供缓存预热、清理、统计等功能
 */
@Service
public class CacheManagementService {
    
    private static final Logger logger = Logger.getLogger(CacheManagementService.class.getName());
    
    @Autowired
    private CacheManager cacheManager;
    
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private TableService tableService;
    
    @Autowired
    private QueryService queryService;
    
    /**
     * 预热所有缓存
     */
    public void warmUpAllCaches() {
        logger.info("开始预热缓存...");
        
        try {
            // 预热表信息缓存
            warmUpTablesCache();
            
            // 预热常用查询缓存
            warmUpCommonQueries();
            
            logger.info("缓存预热完成");
        } catch (Exception e) {
            logger.severe("缓存预热失败: " + e.getMessage());
        }
    }
    
    /**
     * 预热表信息缓存
     */
    private void warmUpTablesCache() {
        try {
            // 预加载所有表信息
            tableService.getTables();
            logger.info("表信息缓存预热完成");
        } catch (Exception e) {
            logger.warning("表信息缓存预热失败: " + e.getMessage());
        }
    }
    
    /**
     * 预热常用查询缓存
     */
    private void warmUpCommonQueries() {
        try {
            // 这里可以添加常用查询的预热逻辑
            // 例如：预加载热门表的字段信息
            logger.info("常用查询缓存预热完成");
        } catch (Exception e) {
            logger.warning("常用查询缓存预热失败: " + e.getMessage());
        }
    }
    
    /**
     * 清理指定缓存
     */
    public void evictCache(String cacheName) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                logger.info("缓存 [" + cacheName + "] 已清理");
            } else {
                logger.warning("缓存 [" + cacheName + "] 不存在");
            }
        } catch (Exception e) {
            logger.severe("清理缓存失败: " + e.getMessage());
        }
    }
    
    /**
     * 清理所有缓存
     */
    public void evictAllCaches() {
        try {
            Collection<String> cacheNames = cacheManager.getCacheNames();
            for (String cacheName : cacheNames) {
                evictCache(cacheName);
            }
            logger.info("所有缓存已清理");
        } catch (Exception e) {
            logger.severe("清理所有缓存失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取缓存统计信息
     */
    public String getCacheStatistics() {
        StringBuilder stats = new StringBuilder();
        stats.append("=== 缓存统计信息 ===\n");
        
        try {
            Collection<String> cacheNames = cacheManager.getCacheNames();
            for (String cacheName : cacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    stats.append("缓存名称: ").append(cacheName).append("\n");
                    
                    if (redisTemplate != null) {
                        // 获取Redis中该缓存的key数量
                        Set<String> keys = redisTemplate.keys("ksh:cache:" + cacheName + "*");
                        stats.append("  - 缓存项数量: ").append(keys != null ? keys.size() : 0).append("\n");
                        
                        // 获取TTL信息（示例）
                        if (keys != null && !keys.isEmpty()) {
                            String firstKey = keys.iterator().next();
                            Long ttl = redisTemplate.getExpire(firstKey, TimeUnit.SECONDS);
                            stats.append("  - 示例TTL: ").append(ttl).append("秒\n");
                        }
                    } else {
                        stats.append("  - 使用内存缓存\n");
                    }
                }
            }
        } catch (Exception e) {
            stats.append("获取统计信息失败: ").append(e.getMessage()).append("\n");
        }
        
        return stats.toString();
    }
    
    /**
     * 检查Redis连接状态
     */
    public boolean isRedisConnected() {
        if (redisTemplate == null) {
            return false;
        }
        try {
            redisTemplate.opsForValue().set("health_check", "ok", 10, TimeUnit.SECONDS);
            String result = (String) redisTemplate.opsForValue().get("health_check");
            return "ok".equals(result);
        } catch (Exception e) {
            logger.warning("Redis连接检查失败: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * 获取缓存健康状态
     */
    public String getCacheHealthStatus() {
        StringBuilder status = new StringBuilder();
        status.append("=== 缓存健康状态 ===\n");
        
        // 检查Redis连接
        boolean redisConnected = isRedisConnected();
        status.append("Redis连接状态: ").append(redisConnected ? "正常" : "异常").append("\n");
        
        // 检查缓存管理器
        Collection<String> cacheNames = cacheManager.getCacheNames();
        status.append("已配置缓存数量: ").append(cacheNames.size()).append("\n");
        status.append("缓存列表: ").append(String.join(", ", cacheNames)).append("\n");
        
        return status.toString();
    }
}
package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.List;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.logging.Logger;

/**
 * 高性能缓存管理器
 * 使用读写锁提升并发性能，支持多级缓存
 */
@Service
public class CustomCacheManager {
    private static final Logger logger = Logger.getLogger(CustomCacheManager.class.getName());
    
    // 多级缓存存储
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
    // 缓存配置
    private static final long DEFAULT_TTL = 10 * 60 * 1000; // 10分钟默认TTL
    private static final long MAX_CACHE_SIZE = 1000; // 最大缓存条目数
    
    /**
     * 缓存条目类
     */
    private static class CacheEntry {
        private final Object data;
        private final long createTime;
        private final long ttl;
        private volatile long lastAccessTime;
        private volatile int accessCount;
        
        public CacheEntry(Object data, long ttl) {
            this.data = data;
            this.createTime = System.currentTimeMillis();
            this.ttl = ttl;
            this.lastAccessTime = this.createTime;
            this.accessCount = 0;
        }
        
        public boolean isExpired() {
            return System.currentTimeMillis() - createTime > ttl;
        }
        
        public Object getData() {
            this.lastAccessTime = System.currentTimeMillis();
            this.accessCount++;
            return data;
        }
        
        public int getAccessCount() {
            return accessCount;
        }
        
        public long getLastAccessTime() {
            return lastAccessTime;
        }
    }
    
    /**
     * 获取缓存数据
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key) {
        lock.readLock().lock();
        try {
            CacheEntry entry = cache.get(key);
            if (entry != null && !entry.isExpired()) {
                logger.info("缓存命中: " + key + " (访问次数: " + entry.getAccessCount() + ")");
                return (T) entry.getData();
            }
            return null;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    /**
     * 设置缓存数据
     */
    public void put(String key, Object data) {
        put(key, data, DEFAULT_TTL);
    }
    
    /**
     * 设置缓存数据（指定TTL）
     */
    public void put(String key, Object data, long ttl) {
        lock.writeLock().lock();
        try {
            // 检查缓存大小，执行LRU清理
            if (cache.size() >= MAX_CACHE_SIZE) {
                evictLRU();
            }
            
            cache.put(key, new CacheEntry(data, ttl));
            logger.info("缓存已更新: " + key + " (TTL: " + ttl + "ms)");
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 清除指定缓存
     */
    public void evict(String key) {
        lock.writeLock().lock();
        try {
            cache.remove(key);
            logger.info("缓存已清除: " + key);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 清除所有缓存
     */
    public void evictAll() {
        lock.writeLock().lock();
        try {
            cache.clear();
            logger.info("所有缓存已清除");
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * LRU清理策略
     */
    private void evictLRU() {
        if (cache.isEmpty()) return;
        
        String lruKey = cache.entrySet().stream()
                .min((e1, e2) -> Long.compare(
                        e1.getValue().getLastAccessTime(), 
                        e2.getValue().getLastAccessTime()))
                .map(Map.Entry::getKey)
                .orElse(null);
        
        if (lruKey != null) {
            cache.remove(lruKey);
            logger.info("LRU清理缓存: " + lruKey);
        }
    }
    
    /**
     * 获取缓存统计信息
     */
    public Map<String, Object> getCacheStats() {
        lock.readLock().lock();
        try {
            Map<String, Object> stats = new ConcurrentHashMap<>();
            stats.put("size", cache.size());
            stats.put("maxSize", MAX_CACHE_SIZE);
            stats.put("defaultTTL", DEFAULT_TTL);
            
            int expiredCount = (int) cache.values().stream()
                    .mapToInt(entry -> entry.isExpired() ? 1 : 0)
                    .sum();
            stats.put("expiredCount", expiredCount);
            
            return stats;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    /**
     * 清理过期缓存
     */
    public void cleanupExpired() {
        lock.writeLock().lock();
        try {
            cache.entrySet().removeIf(entry -> entry.getValue().isExpired());
            logger.info("过期缓存清理完成");
        } finally {
            lock.writeLock().unlock();
        }
    }
}
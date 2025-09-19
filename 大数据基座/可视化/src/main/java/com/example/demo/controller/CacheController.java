package com.example.demo.controller;

import com.example.demo.service.CacheManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 缓存管理控制器
 * 提供缓存管理相关的API接口
 */
@RestController
@RequestMapping("/api/cache")
public class CacheController {
    
    @Autowired
    private CacheManagementService cacheManagementService;
    
    /**
     * 预热所有缓存
     */
    @PostMapping("/warmup")
    public ResponseEntity<Map<String, Object>> warmUpCaches() {
        Map<String, Object> response = new HashMap<>();
        try {
            cacheManagementService.warmUpAllCaches();
            response.put("success", true);
            response.put("message", "缓存预热完成");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "缓存预热失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * 清理指定缓存
     */
    @DeleteMapping("/{cacheName}")
    public ResponseEntity<Map<String, Object>> evictCache(@PathVariable String cacheName) {
        Map<String, Object> response = new HashMap<>();
        try {
            cacheManagementService.evictCache(cacheName);
            response.put("success", true);
            response.put("message", "缓存 [" + cacheName + "] 清理完成");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "缓存清理失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * 清理所有缓存
     */
    @DeleteMapping("/all")
    public ResponseEntity<Map<String, Object>> evictAllCaches() {
        Map<String, Object> response = new HashMap<>();
        try {
            cacheManagementService.evictAllCaches();
            response.put("success", true);
            response.put("message", "所有缓存清理完成");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "缓存清理失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * 获取缓存统计信息
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getCacheStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            String statistics = cacheManagementService.getCacheStatistics();
            response.put("success", true);
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取缓存统计失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * 获取缓存健康状态
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getCacheHealth() {
        Map<String, Object> response = new HashMap<>();
        try {
            String healthStatus = cacheManagementService.getCacheHealthStatus();
            boolean isRedisConnected = cacheManagementService.isRedisConnected();
            
            response.put("success", true);
            response.put("data", healthStatus);
            response.put("redisConnected", isRedisConnected);
            response.put("status", isRedisConnected ? "healthy" : "unhealthy");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取缓存健康状态失败: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.ok(response);
        }
    }
}
package com.example.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 性能监控工具类
 */
@Component
public class PerformanceMonitor {
    
    private static final Logger logger = LoggerFactory.getLogger(PerformanceMonitor.class);
    
    // 慢查询阈值（毫秒）
    private static final long SLOW_QUERY_THRESHOLD = 2000;
    
    // 统计信息
    private final ConcurrentHashMap<String, AtomicLong> queryCount = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> totalExecutionTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> slowQueryCount = new ConcurrentHashMap<>();
    
    /**
     * 记录查询开始时间
     */
    public long startQuery(String queryType, String sql) {
        long startTime = System.currentTimeMillis();
        logger.debug("开始执行查询 [{}]: {}", queryType, sql.length() > 100 ? sql.substring(0, 100) + "..." : sql);
        return startTime;
    }
    
    /**
     * 记录查询结束时间并统计
     */
    public void endQuery(String queryType, String sql, long startTime, int resultCount) {
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        
        // 更新统计信息
        queryCount.computeIfAbsent(queryType, k -> new AtomicLong(0)).incrementAndGet();
        totalExecutionTime.computeIfAbsent(queryType, k -> new AtomicLong(0)).addAndGet(executionTime);
        
        // 检查是否为慢查询
        if (executionTime >= SLOW_QUERY_THRESHOLD) {
            slowQueryCount.computeIfAbsent(queryType, k -> new AtomicLong(0)).incrementAndGet();
            logger.warn("慢查询检测 [{}] 执行时间: {}ms, 结果数量: {}, SQL: {}", 
                       queryType, executionTime, resultCount, 
                       sql.length() > 200 ? sql.substring(0, 200) + "..." : sql);
        } else {
            logger.info("查询完成 [{}] 执行时间: {}ms, 结果数量: {}", queryType, executionTime, resultCount);
        }
    }
    
    /**
     * 记录查询异常
     */
    public void recordQueryError(String queryType, String sql, long startTime, Exception e) {
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        
        logger.error("查询异常 [{}] 执行时间: {}ms, SQL: {}, 错误: {}", 
                    queryType, executionTime, 
                    sql.length() > 200 ? sql.substring(0, 200) + "..." : sql, 
                    e.getMessage());
    }
    
    /**
     * 获取统计信息
     */
    public String getStatistics() {
        StringBuilder stats = new StringBuilder();
        stats.append("\n========== 数据库查询性能统计 ==========\n");
        stats.append("统计时间: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        
        for (String queryType : queryCount.keySet()) {
            long count = queryCount.get(queryType).get();
            long totalTime = totalExecutionTime.get(queryType).get();
            long slowCount = slowQueryCount.getOrDefault(queryType, new AtomicLong(0)).get();
            double avgTime = count > 0 ? (double) totalTime / count : 0;
            
            stats.append(String.format("查询类型: %s\n", queryType));
            stats.append(String.format("  总查询次数: %d\n", count));
            stats.append(String.format("  总执行时间: %dms\n", totalTime));
            stats.append(String.format("  平均执行时间: %.2fms\n", avgTime));
            stats.append(String.format("  慢查询次数: %d (%.2f%%)\n", slowCount, count > 0 ? (double) slowCount / count * 100 : 0));
            stats.append("\n");
        }
        
        stats.append("==========================================\n");
        return stats.toString();
    }
    
    /**
     * 清除统计信息
     */
    public void clearStatistics() {
        queryCount.clear();
        totalExecutionTime.clear();
        slowQueryCount.clear();
        logger.info("性能统计信息已清除");
    }
    
    /**
     * 定时输出统计信息（可以配合定时任务使用）
     */
    public void printStatistics() {
        logger.info(getStatistics());
    }
}
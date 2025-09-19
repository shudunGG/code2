package com.example.demo.config;

import com.example.demo.service.CacheManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

/**
 * 缓存预热配置
 * 应用启动时自动预热缓存
 */
@Component
public class CacheWarmupConfig implements ApplicationRunner {
    
    private static final Logger logger = Logger.getLogger(CacheWarmupConfig.class.getName());
    
    @Autowired
    private CacheManagementService cacheManagementService;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("应用启动完成，开始缓存预热...");
        
        // 延迟5秒后开始预热，确保所有服务都已初始化
        Thread.sleep(5000);
        
        try {
            // 检查Redis连接状态
            if (cacheManagementService.isRedisConnected()) {
                logger.info("Redis连接正常，开始预热缓存");
                cacheManagementService.warmUpAllCaches();
                logger.info("缓存预热完成");
            } else {
                logger.warning("Redis连接异常，跳过缓存预热");
            }
        } catch (Exception e) {
            logger.severe("缓存预热过程中发生错误: " + e.getMessage());
            // 不抛出异常，避免影响应用启动
        }
    }
}
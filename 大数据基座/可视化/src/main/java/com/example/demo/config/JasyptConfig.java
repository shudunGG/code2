package com.example.demo.config;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Jasypt加密配置类
 * 用于加密敏感配置信息如数据库密码、Redis密码等
 */
@Configuration
@EnableEncryptableProperties
public class JasyptConfig {

    /**
     * 配置字符串加密器
     * @return StringEncryptor
     */
    @Bean("jasyptStringEncryptor")
    public StringEncryptor stringEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        
        // 设置加密密钥，实际使用时应从环境变量或启动参数获取
        config.setPassword(getEncryptorPassword());
        // 设置加密算法
        config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");
        // 设置密钥获取迭代次数
        config.setKeyObtentionIterations("1000");
        // 设置连接池大小
        config.setPoolSize("1");
        // 设置盐值生成器
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        // 设置IV生成器
        config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
        // 设置字符串输出类型
        config.setStringOutputType("base64");
        
        encryptor.setConfig(config);
        return encryptor;
    }
    
    /**
     * 获取加密密钥
     * 优先级：环境变量 > 系统属性 > 默认值
     * @return 加密密钥
     */
    private String getEncryptorPassword() {
        // 从环境变量获取
        String password = System.getenv("JASYPT_ENCRYPTOR_PASSWORD");
        if (password != null && !password.trim().isEmpty()) {
            return password;
        }
        
        // 从系统属性获取
        password = System.getProperty("jasypt.encryptor.password");
        if (password != null && !password.trim().isEmpty()) {
            return password;
        }
        
        // 默认密钥（生产环境中应该通过环境变量设置）
        return "ksh-visualization-secret-key-2024";
    }
}
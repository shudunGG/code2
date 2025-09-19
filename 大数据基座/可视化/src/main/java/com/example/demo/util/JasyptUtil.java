package com.example.demo.util;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;

/**
 * Jasypt加密工具类
 * 用于生成加密后的配置值
 */
public class JasyptUtil {
    
    private static final String DEFAULT_PASSWORD = "ksh-visualization-secret-key-2024";
    
    /**
     * 创建加密器
     * @param password 加密密钥
     * @return 加密器实例
     */
    private static PooledPBEStringEncryptor createEncryptor(String password) {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        
        config.setPassword(password);
        config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
        config.setStringOutputType("base64");
        
        encryptor.setConfig(config);
        return encryptor;
    }
    
    /**
     * 加密字符串
     * @param plainText 明文
     * @param password 加密密钥
     * @return 加密后的字符串
     */
    public static String encrypt(String plainText, String password) {
        PooledPBEStringEncryptor encryptor = createEncryptor(password);
        return encryptor.encrypt(plainText);
    }
    
    /**
     * 使用默认密钥加密字符串
     * @param plainText 明文
     * @return 加密后的字符串
     */
    public static String encrypt(String plainText) {
        return encrypt(plainText, DEFAULT_PASSWORD);
    }
    
    /**
     * 解密字符串
     * @param encryptedText 密文
     * @param password 加密密钥
     * @return 解密后的字符串
     */
    public static String decrypt(String encryptedText, String password) {
        PooledPBEStringEncryptor encryptor = createEncryptor(password);
        return encryptor.decrypt(encryptedText);
    }
    
    /**
     * 使用默认密钥解密字符串
     * @param encryptedText 密文
     * @return 解密后的字符串
     */
    public static String decrypt(String encryptedText) {
        return decrypt(encryptedText, DEFAULT_PASSWORD);
    }
    
    /**
     * 测试加密解密功能
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        String password = "Yycx@vingsoftQvbP%0691";
        String redisPassword = "";
        
        System.out.println("=== Jasypt加密工具 ===");
        System.out.println("数据库密码加密结果: ENC(" + encrypt(password) + ")");
        System.out.println("Redis密码加密结果: ENC(" + encrypt(redisPassword) + ")");
        
        // 验证加密解密
        String encrypted = encrypt(password);
        String decrypted = decrypt(encrypted);
        System.out.println("\n=== 验证加密解密 ===");
        System.out.println("原文: " + password);
        System.out.println("密文: " + encrypted);
        System.out.println("解密: " + decrypted);
        System.out.println("验证结果: " + password.equals(decrypted));
    }
}
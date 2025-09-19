package com.example.demo.exception;

/**
 * 自定义业务异常
 */
public class BusinessException extends RuntimeException {
    
    private Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
    
    public Integer getCode() {
        return code;
    }
    
    public void setCode(Integer code) {
        this.code = code;
    }
    
    // 常用的业务异常静态方法
    public static BusinessException of(String message) {
        return new BusinessException(message);
    }
    
    public static BusinessException of(Integer code, String message) {
        return new BusinessException(code, message);
    }
    
    // 数据库相关异常
    public static BusinessException databaseError(String message) {
        return new BusinessException(5001, "数据库操作失败：" + message);
    }
    
    public static BusinessException tableNotFound(String tableName) {
        return new BusinessException(4041, "表 '" + tableName + "' 不存在");
    }
    
    public static BusinessException dataSourceError(String message) {
        return new BusinessException(5002, "数据源连接失败：" + message);
    }
    
    // 参数相关异常
    public static BusinessException invalidParameter(String parameter) {
        return new BusinessException(4001, "无效的参数：" + parameter);
    }
    
    public static BusinessException missingParameter(String parameter) {
        return new BusinessException(4002, "缺少必需参数：" + parameter);
    }
    
    // SQL相关异常
    public static BusinessException invalidSQL(String message) {
        return new BusinessException(4003, "无效的SQL语句：" + message);
    }
    
    public static BusinessException sqlExecutionError(String message) {
        return new BusinessException(5003, "SQL执行失败：" + message);
    }
    
    // 权限相关异常
    public static BusinessException accessDenied(String message) {
        return new BusinessException(4030, "访问被拒绝：" + message);
    }
    
    public static BusinessException operationNotAllowed(String operation) {
        return new BusinessException(4031, "不允许的操作：" + operation);
    }
}
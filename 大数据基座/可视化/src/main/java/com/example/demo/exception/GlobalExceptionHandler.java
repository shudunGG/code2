package com.example.demo.exception;

import com.example.demo.common.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * 数据库异常处理
     */
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ApiResponse<Void>> handleSQLException(SQLException e, HttpServletRequest request) {
        logger.error("数据库异常: {} - URL: {}", e.getMessage(), request.getRequestURL(), e);
        
        String message;
        if (e.getMessage().contains("Connection")) {
            message = "数据库连接失败，请稍后重试";
        } else if (e.getMessage().contains("Timeout")) {
            message = "数据库查询超时，请检查查询条件";
        } else if (e.getMessage().contains("Table") && e.getMessage().contains("doesn't exist")) {
            message = "指定的表不存在，请检查表名";
        } else {
            message = "数据库操作失败：" + e.getMessage();
        }
        
        return ResponseEntity.ok(ApiResponse.error(500, message));
    }
    
    /**
     * 业务异常处理
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e, HttpServletRequest request) {
        logger.warn("业务异常: {} - URL: {}", e.getMessage(), request.getRequestURL());
        return ResponseEntity.ok(ApiResponse.error(e.getCode(), e.getMessage()));
    }
    
    /**
     * 参数验证异常处理
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ApiResponse<Void>> handleValidationException(Exception e, HttpServletRequest request) {
        logger.warn("参数验证异常: {} - URL: {}", e.getMessage(), request.getRequestURL());
        
        String message;
        if (e instanceof MethodArgumentNotValidException) {
            MethodArgumentNotValidException ex = (MethodArgumentNotValidException) e;
            message = ex.getBindingResult().getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else if (e instanceof BindException) {
            BindException ex = (BindException) e;
            message = ex.getBindingResult().getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else {
            message = "参数验证失败";
        }
        
        return ResponseEntity.ok(ApiResponse.validateError(message));
    }
    
    /**
     * 参数类型转换异常处理
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        logger.warn("参数类型转换异常: {} - URL: {}", e.getMessage(), request.getRequestURL());
        String message = String.format("参数 '%s' 的值 '%s' 无效", e.getName(), e.getValue());
        return ResponseEntity.ok(ApiResponse.validateError(message));
    }
    
    /**
     * 非法参数异常处理
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        logger.warn("非法参数异常: {} - URL: {}", e.getMessage(), request.getRequestURL());
        return ResponseEntity.ok(ApiResponse.validateError("参数错误：" + e.getMessage()));
    }
    
    /**
     * 空指针异常处理
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<Void>> handleNullPointerException(NullPointerException e, HttpServletRequest request) {
        logger.error("空指针异常: {} - URL: {}", e.getMessage(), request.getRequestURL(), e);
        return ResponseEntity.ok(ApiResponse.error("系统内部错误，请联系管理员"));
    }
    
    /**
     * 运行时异常处理
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        logger.error("运行时异常: {} - URL: {}", e.getMessage(), request.getRequestURL(), e);
        
        // 检查是否是已知的异常类型
        if (e.getMessage() != null) {
            if (e.getMessage().contains("表") && e.getMessage().contains("不存在")) {
                return ResponseEntity.ok(ApiResponse.notFound(e.getMessage()));
            } else if (e.getMessage().contains("执行SQL失败")) {
                return ResponseEntity.ok(ApiResponse.error(500, e.getMessage()));
            }
        }
        
        return ResponseEntity.ok(ApiResponse.error("系统繁忙，请稍后重试"));
    }
    
    /**
     * 通用异常处理
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e, HttpServletRequest request) {
        logger.error("未知异常: {} - URL: {}", e.getMessage(), request.getRequestURL(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("系统异常，请联系管理员"));
    }
}
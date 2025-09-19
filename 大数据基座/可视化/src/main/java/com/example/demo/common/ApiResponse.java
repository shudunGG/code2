package com.example.demo.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 统一API响应格式
 * @param <T> 数据类型
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private Integer code;
    private LocalDateTime timestamp;
    
    /**
     * 请求追踪ID（用于日志追踪）
     */
    private String traceId;
    
    /**
     * 分页信息（当响应包含分页数据时）
     */
    private PageInfo pagination;
    
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ApiResponse(boolean success, String message, T data, Integer code) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
        this.code = code;
    }
    
    public ApiResponse(boolean success, Integer code, String message, T data) {
        this();
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }
    
    // 成功响应
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "操作成功", data, 200);
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, 200);
    }
    
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(true, "操作成功", null, 200);
    }
    
    public static <T> ApiResponse<T> success(T data, PageInfo pagination) {
        ApiResponse<T> response = new ApiResponse<>(true, "操作成功", data, 200);
        response.setPagination(pagination);
        return response;
    }
    
    // 业务异常响应
    public static <T> ApiResponse<T> businessError(String message) {
        return new ApiResponse<>(false, message, null, 400);
    }
    
    // 参数错误响应
    public static <T> ApiResponse<T> paramError(String message) {
        return new ApiResponse<>(false, message, null, 422);
    }
    
    // 失败响应
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, 500);
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return new ApiResponse<>(false, message, null, code);
    }
    
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, 500);
    }
    
    // 参数验证失败
    public static <T> ApiResponse<T> validateError(String message) {
        return new ApiResponse<>(false, message, null, 400);
    }
    
    // 未授权
    public static <T> ApiResponse<T> unauthorized(String message) {
        return new ApiResponse<>(false, message, null, 401);
    }
    
    // 禁止访问
    public static <T> ApiResponse<T> forbidden(String message) {
        return new ApiResponse<>(false, message, null, 403);
    }
    
    // 资源不存在
    public static <T> ApiResponse<T> notFound(String message) {
        return new ApiResponse<>(false, message, null, 404);
    }
    
    // 设置追踪ID
    public ApiResponse<T> withTraceId(String traceId) {
        this.traceId = traceId;
        return this;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public Integer getCode() {
        return code;
    }
    
    public void setCode(Integer code) {
        this.code = code;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public PageInfo getPagination() {
        return pagination;
    }

    public void setPagination(PageInfo pagination) {
        this.pagination = pagination;
    }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", code=" + code +
                ", timestamp=" + timestamp +
                ", traceId='" + traceId + '\'' +
                ", pagination=" + pagination +
                '}';
    }
    
    /**
     * 分页信息内部类
     */
    @Data
    @NoArgsConstructor
    public static class PageInfo {
        /**
         * 当前页码
         */
        private Integer currentPage;
        
        /**
         * 每页大小
         */
        private Integer pageSize;
        
        /**
         * 总记录数
         */
        private Long totalCount;
        
        /**
         * 总页数
         */
        private Integer totalPages;
        
        /**
         * 是否有下一页
         */
        private Boolean hasNext;
        
        /**
         * 是否有上一页
         */
        private Boolean hasPrevious;
        
        public PageInfo(Integer currentPage, Integer pageSize, Long totalCount) {
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalCount = totalCount;
            this.totalPages = (int) Math.ceil((double) totalCount / pageSize);
            this.hasNext = currentPage < totalPages;
            this.hasPrevious = currentPage > 1;
        }
    }
}
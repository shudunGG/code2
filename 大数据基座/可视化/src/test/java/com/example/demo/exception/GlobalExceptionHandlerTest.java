package com.example.demo.exception;

import com.example.demo.common.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import javax.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        // Setup if needed
    }

    @Test
    void testHandleBusinessException() {
        // Arrange
        String errorMessage = "业务逻辑错误";
        BusinessException exception = new BusinessException(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleBusinessException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals(errorMessage, response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleSQLException() {
        // Arrange
        String errorMessage = "数据库访问错误";
        SQLException exception = new SQLException(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleSQLException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("数据库操作失败"));
        assertTrue(response.getBody().getMessage().contains(errorMessage));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleValidationException() {
        // Arrange
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        
        List<FieldError> fieldErrors = Arrays.asList(
            new FieldError("user", "name", "姓名不能为空"),
            new FieldError("user", "email", "邮箱格式不正确")
        );
        
        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(fieldErrors);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleValidationException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("参数验证失败"));
        assertTrue(response.getBody().getMessage().contains("姓名不能为空"));
        assertTrue(response.getBody().getMessage().contains("邮箱格式不正确"));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleIllegalArgumentException() {
        // Arrange
        String errorMessage = "非法参数";
        IllegalArgumentException exception = new IllegalArgumentException(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleIllegalArgumentException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("参数错误"));
        assertTrue(response.getBody().getMessage().contains(errorMessage));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleNullPointerException() {
        // Arrange
        String errorMessage = "空指针异常";
        NullPointerException exception = new NullPointerException(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleNullPointerException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("系统内部错误"));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleGenericException() {
        // Arrange
        String errorMessage = "未知错误";
        Exception exception = new Exception(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("系统异常"));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleRuntimeException() {
        // Arrange
        String errorMessage = "运行时异常";
        RuntimeException exception = new RuntimeException(errorMessage);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleRuntimeException(exception, mock(javax.servlet.http.HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("运行时错误"));
        assertTrue(response.getBody().getMessage().contains(errorMessage));
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleBusinessException_WithNullMessage() {
        // Arrange
        BusinessException exception = new BusinessException(null);

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleBusinessException(exception, mock(HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertNotNull(response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleBusinessException_WithEmptyMessage() {
        // Arrange
        BusinessException exception = new BusinessException("");

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleBusinessException(exception, mock(HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testHandleValidationException_WithEmptyFieldErrors() {
        // Arrange
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        
        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<ApiResponse<Void>> response = globalExceptionHandler.handleValidationException(exception, mock(HttpServletRequest.class));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("参数验证失败"));
        assertNull(response.getBody().getData());
    }
}
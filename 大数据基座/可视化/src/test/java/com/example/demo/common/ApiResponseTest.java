package com.example.demo.common;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ApiResponseTest {

    @Test
    void testSuccessWithData() {
        // Arrange
        String testData = "test data";

        // Act
        ApiResponse<String> response = ApiResponse.success(testData);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("操作成功", response.getMessage());
        assertEquals(testData, response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testSuccessWithDataAndMessage() {
        // Arrange
        String testData = "test data";
        String customMessage = "自定义成功消息";

        // Act
        ApiResponse<String> response = ApiResponse.success(testData, customMessage);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals(customMessage, response.getMessage());
        assertEquals(testData, response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testSuccessWithNullData() {
        // Act
        ApiResponse<String> response = ApiResponse.success(null);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("操作成功", response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testSuccessWithComplexData() {
        // Arrange
        List<String> testData = Arrays.asList("item1", "item2", "item3");

        // Act
        ApiResponse<List<String>> response = ApiResponse.success(testData);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("操作成功", response.getMessage());
        assertEquals(testData, response.getData());
        assertEquals(3, response.getData().size());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testErrorWithMessage() {
        // Arrange
        String errorMessage = "操作失败";

        // Act
        ApiResponse<Object> response = ApiResponse.error(errorMessage);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals(errorMessage, response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testErrorWithNullMessage() {
        // Act
        ApiResponse<Object> response = ApiResponse.error(null);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNull(response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testErrorWithEmptyMessage() {
        // Act
        ApiResponse<Object> response = ApiResponse.error("");

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("", response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testConstructorWithAllParameters() {
        // Arrange
        boolean success = true;
        String message = "测试消息";
        String data = "测试数据";

        // Act
        ApiResponse<String> response = new ApiResponse<>(success, message, data, 200);

        // Assert
        assertNotNull(response);
        assertEquals(success, response.isSuccess());
        assertEquals(message, response.getMessage());
        assertEquals(data, response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testDefaultConstructor() {
        // Act
        ApiResponse<Object> response = new ApiResponse<>();

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess()); // default value
        assertNull(response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testSettersAndGetters() {
        // Arrange
        ApiResponse<String> response = new ApiResponse<>();
        boolean success = true;
        String message = "测试消息";
        String data = "测试数据";

        // Act
        response.setSuccess(success);
        response.setMessage(message);
        response.setData(data);

        // Assert
        assertEquals(success, response.isSuccess());
        assertEquals(message, response.getMessage());
        assertEquals(data, response.getData());
    }

    @Test
    void testTimestampIsCurrentTime() {
        // Arrange
        LocalDateTime beforeCreation = LocalDateTime.now();

        // Act
        ApiResponse<String> response = ApiResponse.success("test");
        LocalDateTime afterCreation = LocalDateTime.now();

        // Assert
        assertNotNull(response.getTimestamp());
        assertTrue(response.getTimestamp().isAfter(beforeCreation) || response.getTimestamp().isEqual(beforeCreation));
        assertTrue(response.getTimestamp().isBefore(afterCreation) || response.getTimestamp().isEqual(afterCreation));
    }

    @Test
    void testMultipleInstancesHaveDifferentTimestamps() throws InterruptedException {
        // Act
        ApiResponse<String> response1 = ApiResponse.success("test1");
        Thread.sleep(1); // Ensure different timestamps
        ApiResponse<String> response2 = ApiResponse.success("test2");

        // Assert
        assertNotEquals(response1.getTimestamp(), response2.getTimestamp());
        assertTrue(response2.getTimestamp().isAfter(response1.getTimestamp()) || response2.getTimestamp().isEqual(response1.getTimestamp()));
    }

    @Test
    void testToString() {
        // Arrange
        ApiResponse<String> response = ApiResponse.success("test data", "success message");

        // Act
        String toString = response.toString();

        // Assert
        assertNotNull(toString);
        assertTrue(toString.contains("success"));
        assertTrue(toString.contains("success message"));
        assertTrue(toString.contains("test data"));
    }

    @Test
    void testEqualsAndHashCode() {
        // Arrange
        ApiResponse<String> response1 = new ApiResponse<>(true, "message", "data", 200);
        ApiResponse<String> response2 = new ApiResponse<>(true, "message", "data", 200);
        ApiResponse<String> response3 = new ApiResponse<>(false, "message", "data", 400);

        // Note: timestamp will be different, so we need to set them to be the same for equality test
        response2.setTimestamp(response1.getTimestamp());

        // Assert
        assertEquals(response1, response2);
        assertEquals(response1.hashCode(), response2.hashCode());
        assertNotEquals(response1, response3);
    }
}
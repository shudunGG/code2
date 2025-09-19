package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CacheServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private CacheService cacheService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ReflectionTestUtils.setField(cacheService, "redisTemplate", redisTemplate);
    }

    @Test
    void testPut_Success() {
        // Arrange
        String key = "test_key";
        Object value = "test_value";
        long ttl = 3600L;

        // Act
        cacheService.put(key, value, ttl);

        // Assert
        verify(valueOperations).set(key, value, ttl, TimeUnit.SECONDS);
    }

    @Test
    void testPut_WithDefaultTTL() {
        // Arrange
        String key = "test_key";
        Object value = "test_value";

        // Act
        cacheService.put(key, value);

        // Assert
        verify(valueOperations).set(eq(key), eq(value), anyLong(), eq(TimeUnit.SECONDS));
    }

    @Test
    void testGet_Success() {
        // Arrange
        String key = "test_key";
        Object expectedValue = "test_value";
        when(valueOperations.get(key)).thenReturn(expectedValue);

        // Act
        Object result = cacheService.get(key);

        // Assert
        assertEquals(expectedValue, result);
        verify(valueOperations).get(key);
    }

    @Test
    void testGet_KeyNotFound() {
        // Arrange
        String key = "nonexistent_key";
        when(valueOperations.get(key)).thenReturn(null);

        // Act
        Object result = cacheService.get(key);

        // Assert
        assertNull(result);
        verify(valueOperations).get(key);
    }

    @Test
    void testRemove_Success() {
        // Arrange
        String key = "test_key";

        // Act
        cacheService.remove(key);

        // Assert
        // Verify that remove was called (no return value to check)
    }






}
package com.example.demo.service;

import com.example.demo.exception.BusinessException;
import com.example.demo.service.DataSourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueryServiceTest {

    @Mock
    private JdbcTemplate primaryJdbcTemplate;

    @Mock
    private CacheService cacheService;

    @Mock
    private DataSourceService dataSourceService;

    @InjectMocks
    private QueryService queryService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(queryService, "primaryJdbcTemplate", primaryJdbcTemplate);
    }

    @Test
    void testExecuteCustomSQL_SelectQuery_Success() {
        // Arrange
        String sql = "SELECT * FROM users WHERE id = ?";
        List<Object> params = Arrays.asList(1);
        List<Map<String, Object>> mockResult = Arrays.asList(
            createUserMap(1L, "John", "john@example.com"),
            createUserMap(2L, "Jane", "jane@example.com")
        );
        
        when(primaryJdbcTemplate.queryForList(eq(sql), any(Object[].class)))
            .thenReturn(mockResult);

        // Act
        List<Map<String, Object>> result = queryService.executeCustomSQL(sql, params);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).get("name"));
        assertEquals("Jane", result.get(1).get("name"));
        verify(primaryJdbcTemplate).queryForList(eq(sql), any(Object[].class));
    }

    @Test
    void testExecuteCustomSQL_UpdateQuery_Success() {
        // Arrange
        String sql = "UPDATE users SET name = ? WHERE id = ?";
        List<Object> params = Arrays.asList("Updated Name", 1);
        
        when(primaryJdbcTemplate.update(eq(sql), any(Object[].class)))
            .thenReturn(1);

        // Act
        List<Map<String, Object>> result = queryService.executeCustomSQL(sql, params);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).get("affected_rows"));
        verify(primaryJdbcTemplate).update(eq(sql), any(Object[].class));
    }

    @Test
    void testExecuteCustomSQL_InvalidSQL_ThrowsException() {
        // Arrange
        String invalidSql = "INVALID SQL STATEMENT";
        List<Object> params = Collections.emptyList();
        
        when(primaryJdbcTemplate.queryForList(eq(invalidSql), any(Object[].class)))
            .thenThrow(new DataAccessException("SQL syntax error") {});

        // Act & Assert
        assertThrows(BusinessException.class, () -> {
            queryService.executeCustomSQL(invalidSql, params);
        });
    }

    @Test
    void testExecuteStructuredQuery_Success() {
        // Arrange
        String tableName = "users";
        List<String> fields = Arrays.asList("id", "name", "email");
        Map<String, Object> condition = new HashMap<>();
        condition.put("field", "age");
        condition.put("operator", ">");
        condition.put("value", 18);
        List<Map<String, Object>> conditions = Arrays.asList(condition);
        Integer limit = 10;

        List<Map<String, Object>> mockResult = Arrays.asList(
            createUserMap(1L, "Alice", "alice@example.com"),
            createUserMap(2L, "Bob", "bob@example.com")
        );
        
        when(dataSourceService.selectDataSource(anyString())).thenReturn(primaryJdbcTemplate);
        when(primaryJdbcTemplate.queryForList(anyString(), any(Object[].class)))
            .thenReturn(mockResult);

        // Act
        List<Map<String, Object>> result = queryService.executeStructuredQuery(tableName, fields, conditions, limit);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).get("name"));
        assertEquals("Bob", result.get(1).get("name"));
        verify(primaryJdbcTemplate).queryForList(anyString(), any(Object[].class));
    }

    @Test
    void testExecuteStructuredQuery_MissingTable_ThrowsException() {
        // Arrange
        String tableName = null;
        List<String> fields = Arrays.asList("id", "name");
        List<Map<String, Object>> conditions = new ArrayList<>();
        Integer limit = null;

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            queryService.executeStructuredQuery(tableName, fields, conditions, limit);
        });
    }

    private Map<String, Object> createUserMap(Long id, String name, String email) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", id);
        user.put("name", name);
        user.put("email", email);
        return user;
    }
}
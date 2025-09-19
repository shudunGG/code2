package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock
    private JdbcTemplate primaryJdbcTemplate;

    @Mock
    private CacheService cacheService;

    @InjectMocks
    private TableService tableService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tableService, "primaryJdbcTemplate", primaryJdbcTemplate);
    }

    @Test
    void testGetAllTables_Success() {
        // Arrange
        List<Map<String, Object>> mockTables = Arrays.asList(
            createTableMap("users", "InnoDB", 100L),
            createTableMap("orders", "InnoDB", 50L)
        );
        when(primaryJdbcTemplate.queryForList(anyString())).thenReturn(mockTables);
        when(cacheService.get(anyString())).thenReturn(null);

        // Act
        List<Map<String, Object>> result = tableService.getAllTables();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("users", result.get(0).get("TABLE_NAME"));
        assertEquals("orders", result.get(1).get("TABLE_NAME"));
        verify(cacheService).put(anyString(), eq(result), anyLong());
    }

    @Test
    void testGetAllTables_FromCache() {
        // Arrange
        List<Map<String, Object>> cachedTables = Arrays.asList(
            createTableMap("cached_table", "InnoDB", 75L)
        );
        when(cacheService.get("tables_all")).thenReturn(cachedTables);

        // Act
        List<Map<String, Object>> result = tableService.getAllTables();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("cached_table", result.get(0).get("TABLE_NAME"));
        verify(primaryJdbcTemplate, never()).queryForList(anyString());
    }

    @Test
    void testGetTableDetails_Success() {
        // Arrange
        String tableName = "users";
        Map<String, Object> mockTableInfo = createTableMap(tableName, "InnoDB", 100L);
        List<Map<String, Object>> mockColumns = Arrays.asList(
            createColumnMap("id", "bigint", "NO", "PRI"),
            createColumnMap("name", "varchar(255)", "YES", "")
        );
        List<Map<String, Object>> mockIndexes = Arrays.asList(
            createIndexMap("PRIMARY", "id", false),
            createIndexMap("idx_name", "name", true)
        );

        when(primaryJdbcTemplate.queryForList(contains("INFORMATION_SCHEMA.TABLES"), eq(tableName)))
            .thenReturn(Arrays.asList(mockTableInfo));
        when(primaryJdbcTemplate.queryForList(contains("INFORMATION_SCHEMA.COLUMNS"), eq(tableName)))
            .thenReturn(mockColumns);
        when(primaryJdbcTemplate.queryForList(contains("SHOW INDEX"), eq(tableName)))
            .thenReturn(mockIndexes);
        when(cacheService.get(anyString())).thenReturn(null);

        // Act
        Map<String, Object> result = tableService.getTableDetails(tableName);

        // Assert
        assertNotNull(result);
        assertEquals(tableName, result.get("tableName"));
        assertNotNull(result.get("tableInfo"));
        assertNotNull(result.get("columns"));
        assertNotNull(result.get("indexes"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resultColumns = (List<Map<String, Object>>) result.get("columns");
        assertEquals(2, resultColumns.size());
        
        verify(cacheService).put(anyString(), eq(result), anyLong());
    }

    @Test
    void testGetTableDetails_TableNotFound() {
        // Arrange
        String tableName = "nonexistent_table";
        when(primaryJdbcTemplate.queryForList(contains("INFORMATION_SCHEMA.TABLES"), eq(tableName)))
            .thenReturn(Collections.emptyList());
        when(cacheService.get(anyString())).thenReturn(null);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            tableService.getTableDetails(tableName);
        });
    }

    @Test
    void testGetTableDetails_FromCache() {
        // Arrange
        String tableName = "cached_table";
        Map<String, Object> cachedDetails = new HashMap<>();
        cachedDetails.put("tableName", tableName);
        cachedDetails.put("tableInfo", createTableMap(tableName, "InnoDB", 50L));
        
        when(cacheService.get("table_details_" + tableName)).thenReturn(cachedDetails);

        // Act
        Map<String, Object> result = tableService.getTableDetails(tableName);

        // Assert
        assertNotNull(result);
        assertEquals(tableName, result.get("tableName"));
        verify(primaryJdbcTemplate, never()).queryForList(anyString(), anyString());
    }

    private Map<String, Object> createTableMap(String tableName, String engine, Long tableRows) {
        Map<String, Object> table = new HashMap<>();
        table.put("TABLE_NAME", tableName);
        table.put("ENGINE", engine);
        table.put("TABLE_ROWS", tableRows);
        table.put("TABLE_SCHEMA", "test_db");
        return table;
    }

    private Map<String, Object> createColumnMap(String columnName, String dataType, String isNullable, String columnKey) {
        Map<String, Object> column = new HashMap<>();
        column.put("COLUMN_NAME", columnName);
        column.put("DATA_TYPE", dataType);
        column.put("IS_NULLABLE", isNullable);
        column.put("COLUMN_KEY", columnKey);
        return column;
    }

    private Map<String, Object> createIndexMap(String indexName, String columnName, boolean nonUnique) {
        Map<String, Object> index = new HashMap<>();
        index.put("Key_name", indexName);
        index.put("Column_name", columnName);
        index.put("Non_unique", nonUnique ? 1 : 0);
        return index;
    }
}
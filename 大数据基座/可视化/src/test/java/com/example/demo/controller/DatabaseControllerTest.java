package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.service.DatabaseService;
import com.example.demo.service.QueryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(DatabaseController.class)
class DatabaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DatabaseService databaseService;

    @MockBean
    private QueryService queryService;

    @Autowired
    private ObjectMapper objectMapper;

    private List<Map<String, Object>> mockTables;
    private Map<String, Object> mockTableDetails;

    @BeforeEach
    void setUp() {
        // Setup mock data
        mockTables = Arrays.asList(
            createTableMap("users", "InnoDB", 100L),
            createTableMap("orders", "InnoDB", 50L)
        );

        mockTableDetails = new HashMap<>();
        mockTableDetails.put("tableName", "users");
        mockTableDetails.put("tableInfo", createTableMap("users", "InnoDB", 100L));
        mockTableDetails.put("columns", Arrays.asList(
            createColumnMap("id", "bigint", "NO", "PRI"),
            createColumnMap("name", "varchar(255)", "YES", "")
        ));
        mockTableDetails.put("indexes", Arrays.asList(
            createIndexMap("PRIMARY", "id", false)
        ));
    }

    @Test
    void testGetTables_Success() throws Exception {
        // Arrange
        when(databaseService.getTables()).thenReturn(mockTables);

        // Act & Assert
        mockMvc.perform(get("/api/database/tables")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].TABLE_NAME").value("users"))
                .andExpect(jsonPath("$.data[1].TABLE_NAME").value("orders"));

        verify(databaseService).getTables();
    }

    @Test
    void testGetTables_Exception() throws Exception {
        // Arrange
        when(databaseService.getTables()).thenThrow(new RuntimeException("Database connection failed"));

        // Act & Assert
        mockMvc.perform(get("/api/database/tables")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("获取表列表失败: Database connection failed"));

        verify(databaseService).getTables();
    }

    @Test
    void testGetTableDetails_Success() throws Exception {
        // Arrange
        String tableName = "users";
        when(databaseService.getTableDetails(tableName)).thenReturn(mockTableDetails);

        // Act & Assert
        mockMvc.perform(get("/api/database/tables/{tableName}", tableName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.tableName").value("users"))
                .andExpect(jsonPath("$.data.tableInfo.TABLE_NAME").value("users"))
                .andExpect(jsonPath("$.data.columns").isArray())
                .andExpect(jsonPath("$.data.indexes").isArray());

        verify(databaseService).getTableDetails(tableName);
    }

    @Test
    void testGetTableDetails_TableNotFound() throws Exception {
        // Arrange
        String tableName = "nonexistent_table";
        when(databaseService.getTableDetails(tableName))
            .thenThrow(new RuntimeException("Table not found"));

        // Act & Assert
        mockMvc.perform(get("/api/database/tables/{tableName}", tableName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("获取表详情失败: Table not found"));

        verify(databaseService).getTableDetails(tableName);
    }

    @Test
    void testExecuteCustomSQL_Success() throws Exception {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("sql", "SELECT * FROM users WHERE id = 1");
        
        List<Map<String, Object>> mockResult = Arrays.asList(
            createUserMap(1L, "John", "john@example.com")
        );
        
        when(queryService.executeCustomSQL(anyString(), anyList()))
            .thenReturn(mockResult);

        // Act & Assert
        mockMvc.perform(post("/api/database/executeCustomSQL")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].name").value("John"));

        verify(queryService).executeCustomSQL(eq("SELECT * FROM users WHERE id = 1"), anyList());
    }

    @Test
    void testExecuteCustomSQL_InvalidSQL() throws Exception {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("sql", "INVALID SQL");
        
        when(queryService.executeCustomSQL(anyString(), anyList()))
            .thenThrow(new RuntimeException("SQL syntax error"));

        // Act & Assert
        mockMvc.perform(post("/api/database/executeCustomSQL")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("执行SQL失败: SQL syntax error"));

        verify(queryService).executeCustomSQL(eq("INVALID SQL"), anyList());
    }

    @Test
    void testExecuteStructuredQuery_Success() throws Exception {
        // Arrange
        Map<String, Object> request = new HashMap<>();
        request.put("table", "users");
        request.put("columns", Arrays.asList("id", "name", "email"));
        Map<String, Object> condition = new HashMap<>();
        condition.put("column", "age");
        condition.put("operator", ">");
        condition.put("value", 18);
        request.put("conditions", Arrays.asList(condition));
        
        List<Map<String, Object>> mockResult = Arrays.asList(
            createUserMap(1L, "Alice", "alice@example.com"),
            createUserMap(2L, "Bob", "bob@example.com")
        );
        
        when(queryService.executeStructuredQuery(anyString(), anyList(), anyList(), anyInt()))
            .thenReturn(mockResult);

        // Act & Assert
        mockMvc.perform(post("/api/database/executeStructuredQuery")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].name").value("Alice"))
                .andExpect(jsonPath("$.data[1].name").value("Bob"));

        verify(queryService).executeStructuredQuery(anyString(), anyList(), anyList(), anyInt());
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

    private Map<String, Object> createUserMap(Long id, String name, String email) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", id);
        user.put("name", name);
        user.put("email", email);
        return user;
    }
}
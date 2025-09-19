package com.example.demo.controller;

import com.example.demo.service.DatabaseService;
import com.example.demo.service.QueryService;
import com.example.demo.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {
    
    @Autowired
    private DatabaseService databaseService;
    
    @Autowired
    private QueryService queryService;
    
    // 替换 "// 表格管理功能已移除" 注释，添加以下方法：
    
    // 获取所有表格列表
    @GetMapping("/tables")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTables() {
        try {
            List<Map<String, Object>> tables = databaseService.getTables();
            return ResponseEntity.ok(ApiResponse.success("获取表格列表成功", tables));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取表格列表失败: " + e.getMessage()));
        }
    }
    
    // 获取表格详细信息
    @GetMapping("/tables/{tableName}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTableDetails(@PathVariable String tableName) {
        try {
            Map<String, Object> tableDetails = databaseService.getTableDetails(tableName);
            return ResponseEntity.ok(ApiResponse.success("获取表格详细信息成功", tableDetails));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取表格详细信息失败: " + e.getMessage()));
        }
    }
    
    // 获取表格数据（分页）
    @GetMapping("/tables/{tableName}/data")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTableData(
            @PathVariable String tableName,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Map<String, Object> tableData = databaseService.getTableData(tableName, page, size);
            
            // 提取分页信息
            List<Map<String, Object>> data = (List<Map<String, Object>>) tableData.get("data");
            Long totalCount = ((Number) tableData.get("totalCount")).longValue();
            
            // 创建分页信息
            ApiResponse.PageInfo pageInfo = new ApiResponse.PageInfo(page, size, totalCount);
            
            return ResponseEntity.ok(ApiResponse.success(data, pageInfo));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取表格数据失败: " + e.getMessage()));
        }
    }
    
    // 获取表字段信息
    @GetMapping("/tables/{tableName}/fields")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTableFields(@PathVariable String tableName) {
        try {
            List<Map<String, Object>> fields = databaseService.getTableFields(tableName);
            return ResponseEntity.ok(ApiResponse.success("获取表格字段成功", fields));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取表格字段失败: " + e.getMessage()));
        }
    }
    
    @GetMapping("/interface-resources")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInterfaceResources(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            Map<String, Object> result = databaseService.getInterfaceResources(page, size);
            
            // 提取分页信息
            List<Map<String, Object>> data = (List<Map<String, Object>>) result.get("data");
            Long totalCount = ((Number) result.get("totalCount")).longValue();
            
            // 创建分页信息
            ApiResponse.PageInfo pageInfo = new ApiResponse.PageInfo(page, size, totalCount);
            
            return ResponseEntity.ok(ApiResponse.success(data, pageInfo));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取接口资源失败: " + e.getMessage()));
        }
    }
    
    @GetMapping("/interface-resources/count")
    @ResponseBody
    public ResponseEntity<ApiResponse<Long>> getInterfaceResourcesCount() {
        try {
            long count = databaseService.getInterfaceResourcesCount();
            return ResponseEntity.ok(ApiResponse.success("获取接口资源数量成功", count));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("获取接口资源数量失败: " + e.getMessage()));
        }
    }
    
    @GetMapping("/interface-resources/search")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchInterfaceResources(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            Map<String, Object> result = databaseService.searchInterfaceResources(keyword, page, size);
            
            // 提取分页信息
            List<Map<String, Object>> data = (List<Map<String, Object>>) result.get("data");
            Long totalCount = ((Number) result.get("totalCount")).longValue();
            
            // 创建分页信息
            ApiResponse.PageInfo pageInfo = new ApiResponse.PageInfo(page, size, totalCount);
            
            return ResponseEntity.ok(ApiResponse.success(data, pageInfo));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("搜索接口资源失败: " + e.getMessage()));
        }
    }
    
    // 执行自定义SQL查询
    // 检查表是否存在
    @GetMapping("/check-table/{tableName}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkTableExists(@PathVariable String tableName) {
        try {
            Map<String, Object> result = databaseService.checkTableExists(tableName);
            return ResponseEntity.ok(ApiResponse.success("检查表成功", result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("检查表失败: " + e.getMessage()));
        }
    }
    
    @PostMapping("/executeCustomSQL")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> executeCustomSQL(@RequestBody Map<String, String> request) {
        try {
            String sql = request.get("sql");
            if (sql == null || sql.trim().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.paramError("SQL语句不能为空"));
            }
            
            List<Map<String, Object>> result = databaseService.executeCustomSQL(sql);
            return ResponseEntity.ok(ApiResponse.success("执行SQL成功", result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("执行SQL失败: " + e.getMessage()));
        }
    }
    
    // 安全的结构化查询API
    @PostMapping("/executeStructuredQuery")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> executeStructuredQuery(@RequestBody Map<String, Object> request) {
        try {
            String tableName = (String) request.get("tableName");
            @SuppressWarnings("unchecked")
            List<String> fields = (List<String>) request.get("fields");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> conditions = (List<Map<String, Object>>) request.get("conditions");
            Integer limit = (Integer) request.get("limit");
            
            if (tableName == null || tableName.trim().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.paramError("表名不能为空"));
            }
            
            if (fields == null || fields.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.paramError("查询字段不能为空"));
            }
            
            List<Map<String, Object>> result = queryService.executeStructuredQuery(tableName, fields, conditions, limit);
            return ResponseEntity.ok(ApiResponse.success("执行查询成功", result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("执行查询失败: " + e.getMessage()));
        }
    }
    
    @PostMapping("/query")
    @ResponseBody
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> executeQuery(@RequestBody Map<String, Object> request) {
        try {
            String tableName = (String) request.get("tableName");
            @SuppressWarnings("unchecked")
            List<String> fields = (List<String>) request.get("fields");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> conditions = (List<Map<String, Object>>) request.get("conditions");
            Integer page = (Integer) request.getOrDefault("page", 1);
            Integer size = (Integer) request.getOrDefault("size", 50);

            // 计算LIMIT值用于分页
            Integer limit = page * size;
            
            List<Map<String, Object>> allResults = queryService.executeStructuredQuery(tableName, fields, conditions, limit);
            
            // 手动分页处理
            int start = (page - 1) * size;
            int end = Math.min(start + size, allResults.size());
            List<Map<String, Object>> pageResults = allResults.subList(start, end);
            
            // 创建分页信息（这里totalCount使用实际查询到的数量）
            ApiResponse.PageInfo pageInfo = new ApiResponse.PageInfo(page, size, (long) allResults.size());
            
            return ResponseEntity.ok(ApiResponse.success(pageResults, pageInfo));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询失败: " + e.getMessage()));
        }
    }
    
}
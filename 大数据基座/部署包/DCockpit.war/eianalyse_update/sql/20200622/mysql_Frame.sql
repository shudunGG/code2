drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_api_response_params')<1
     then
        CREATE TABLE `portrait_tags_api_response_params` (
            `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
            `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务id',
            `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '返回参数名称',
            `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型:String:字符型  Boolean:布尔型  Date:日期型 Integer:整型 Number:数值型  Blob:二进制',
            `remark` text COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
            PRIMARY KEY (`rowguid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
        INSERT INTO `portrait_tags_api_response_params` VALUES ('02aaeff4-2392-423d-b3e4-8d16acb5cb3c', '2a599083-b368-4619-83c1-5198b909a270', 'fs', 'String', '是否全文检索:1:是,其他:否');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('05fa1118-92ea-4030-a810-386fb0bd60b2', 'c14fa968-927d-48d7-8500-55afaf90b7e0', 'name', 'String', '主体名称');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('35af7d1f-c15e-4133-8168-aa3d35bafa10', '2a599083-b368-4619-83c1-5198b909a270', 'alias', 'String', '标签别名');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('514389bf-0725-48a7-a7eb-e421fd8ceb74', '2a599083-b368-4619-83c1-5198b909a270', 'cs', 'String', '筛选条件');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('6b97e7cd-4f35-4bf7-a8df-2db52827180d', '2a599083-b368-4619-83c1-5198b909a270', 'ss', 'String', '是否多值');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('7fcb0cef-e16d-4161-ad7a-7ca294777c5b', '2a599083-b368-4619-83c1-5198b909a270', 'name', 'String', '标签名称');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('860d1272-1648-4312-adad-b7371a8af95f', '2a599083-b368-4619-83c1-5198b909a270', 'searchField', 'String', '查询字段');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('a18bdba9-de6f-4736-84d2-bbfc78aca13b', 'c14fa968-927d-48d7-8500-55afaf90b7e0', 'index', 'String', '全文检索索引名称');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('ce45990f-0102-43db-aa25-483532ce96d0', '2a599083-b368-4619-83c1-5198b909a270', 'codevalues', 'String', '关联代码项');
        INSERT INTO `portrait_tags_api_response_params` VALUES ('cff29088-a477-44ca-94df-22d3e28199d3', 'c14fa968-927d-48d7-8500-55afaf90b7e0', 'alias', 'String', '主体别名');
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
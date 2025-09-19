drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tag_access_rule')<1
     then
        CREATE TABLE `portrait_tag_access_rule` (
            `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
            `entityguid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '主体主键',
            `typeguid` varchar(50) COLLATE utf8_bin DEFAULT NULL,
            `tagguid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '标签主键',
            `rule` int(255) COLLATE utf8_bin DEFAULT NULL COMMENT '规则',
            `value` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数值',
            `remark` text COLLATE utf8_bin COMMENT '备注',
            `ouguid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '权限适用部门',
             PRIMARY KEY (`rowguid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
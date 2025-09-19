drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_conflict_rule')<1
     then
            CREATE TABLE `portrait_tags_conflict_rule` (
              `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
              `entityguid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '主体guid',
              `tagguids` longtext COLLATE utf8_bin COMMENT '标签guid',
              `conflictType` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '冲突类型',
              `isConflict` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '是否冲突',
              `conflictRuleName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '冲突规则名称',
              `ouGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '部门ouguid',
              `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '说明',
              `createDatetime` datetime DEFAULT NULL COMMENT '创建时间',
              `updateDatetime` datetime DEFAULT NULL COMMENT '更新时间',
              `createUserGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '创建人guid',
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
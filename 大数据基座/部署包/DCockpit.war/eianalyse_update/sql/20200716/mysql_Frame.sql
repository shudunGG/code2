-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.columns WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name = 'tpguid')<1
     then
            alter table portrait_entity add column tpguid varchar(255);
     end if;
	if  (SELECT count( 1 ) FROM	information_schema.columns WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_tags' and column_name = 'tagindex')<1
     then
            alter table portrait_tags add column tagindex varchar(20);
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.columns WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_tuk_task' and column_name = 'entityguid')<1
     then
            alter table portrait_tuk_task add column entityguid varchar(50);
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.columns WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_tuk_task' and column_name = 'ruleguid')<1
     then
            alter table portrait_tuk_task add column ruleguid varchar(50);
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.columns WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_tuk_task' and column_name = 'type')<1
     then
            alter table portrait_tuk_task add column `type` varchar(50);
     end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tuk_task_rules')<1
     then
		create table if not exists `portrait_tuk_task_rules`(
		  `BelongXiaQuCode` varchar(50) DEFAULT NULL,
		  `OperateUserName` varchar(50) DEFAULT NULL,
		  `OperateDate` datetime DEFAULT NULL,
		  `Row_ID` int(11) DEFAULT NULL,
		  `YearFlag` varchar(4) DEFAULT NULL,
		  `RowGuid` varchar(50) NOT NULL,
		  `OperateUserGuid` varchar(50) DEFAULT NULL,
		  `OperateUserOUGuid` varchar(50) DEFAULT NULL,
		  `OperateUserBaseOUGuid` varchar(50) DEFAULT NULL,
		  `PVIGuid` varchar(50) DEFAULT NULL,
		  `entityguid` varchar(100) DEFAULT NULL,
		  `gyxqjsonstr` longtext,
		  `sxysjsonstr` longtext,
		  `tag_type` varchar(255) DEFAULT NULL,
		  `source` varchar(50) DEFAULT NULL,
		  `tags_table` varchar(50) DEFAULT NULL,
		  `tags_sql` longtext,
		  `rule_desc` longtext,
		  `ruleentitytype` varchar(50) DEFAULT NULL,
		  `galleryguid` varchar(50) DEFAULT NULL,
		  `sourcerowkey` varchar(100) DEFAULT NULL,
		  `textguid` longtext,
		  PRIMARY KEY (`RowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tuk_relation')<1
     then
		CREATE TABLE `portrait_tuk_relation` (
		  `BelongXiaQuCode` varchar(50) DEFAULT NULL,
		  `OperateUserName` varchar(50) DEFAULT NULL,
		  `OperateDate` datetime DEFAULT NULL,
		  `Row_ID` int(11) DEFAULT NULL,
		  `YearFlag` varchar(4) DEFAULT NULL,
		  `RowGuid` varchar(50) NOT NULL,
		  `OperateUserGuid` varchar(50) DEFAULT NULL,
		  `OperateUserOUGuid` varchar(50) DEFAULT NULL,
		  `OperateUserBaseOUGuid` varchar(50) DEFAULT NULL,
		  `PVIGuid` varchar(50) DEFAULT NULL,
		  `relationname` varchar(50) DEFAULT NULL,
		  `entityguid` varchar(50) DEFAULT NULL,
		  `propertyname` varchar(255) DEFAULT NULL,
		  `galleryguid` varchar(50) DEFAULT NULL,
		  `relationaliasname` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='kgms_textdata')<1
     then
		CREATE TABLE `kgms_textdata` (
		  `BelongXiaQuCode` varchar(50) DEFAULT NULL,
		  `OperateUserName` varchar(50) DEFAULT NULL,
		  `OperateDate` datetime DEFAULT NULL,
		  `Row_ID` int(11) DEFAULT NULL,
		  `YearFlag` varchar(4) DEFAULT NULL,
		  `RowGuid` varchar(50) NOT NULL,
		  `OperateUserGuid` varchar(50) DEFAULT NULL,
		  `OperateUserOUGuid` varchar(50) DEFAULT NULL,
		  `OperateUserBaseOUGuid` varchar(50) DEFAULT NULL,
		  `PVIGuid` varchar(50) DEFAULT NULL,
		  `name` varchar(255) DEFAULT NULL,
		  `importdate` datetime DEFAULT NULL,
		  `modelguid` varchar(50) DEFAULT NULL,
		  `source` varchar(255) DEFAULT NULL,
		  `tablename` varchar(255) DEFAULT NULL,
		  `rowkeyfield` varchar(50) DEFAULT NULL,
		  `hdfsfloder` varchar(255) DEFAULT NULL,
		  `textfield` varchar(255) DEFAULT NULL,
		  `datafrom` varchar(50) DEFAULT NULL,
		  `tpguid` varchar(50) DEFAULT NULL,
		  `predictjson` longtext,
		  PRIMARY KEY (`RowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='kgms_textdata_detail')<1
     then
		CREATE TABLE `kgms_textdata_detail` (
		  `BelongXiaQuCode` varchar(50) DEFAULT NULL,
		  `OperateUserName` varchar(50) DEFAULT NULL,
		  `OperateDate` datetime DEFAULT NULL,
		  `Row_ID` int(11) DEFAULT NULL,
		  `YearFlag` varchar(4) DEFAULT NULL,
		  `RowGuid` varchar(50) NOT NULL,
		  `OperateUserGuid` varchar(50) DEFAULT NULL,
		  `OperateUserOUGuid` varchar(50) DEFAULT NULL,
		  `OperateUserBaseOUGuid` varchar(50) DEFAULT NULL,
		  `PVIGuid` varchar(50) DEFAULT NULL,
		  `entity` longtext,
		  `objectentity` varchar(255) DEFAULT NULL,
		  `textguid` varchar(255) DEFAULT NULL,
		  `sourcerowguid` varchar(255) DEFAULT NULL,
		  `hdfsfilename` varchar(255) DEFAULT NULL,
		  `entity_predict` varchar(255) DEFAULT NULL,
		  `objectentity_predict` varchar(255) DEFAULT NULL,
		  `assert_predict` varchar(255) DEFAULT NULL,
		  `assert` varchar(255) DEFAULT NULL,
		  `target` longtext,
		  `target_hat` longtext,
		  `content` longtext,
		  PRIMARY KEY (`RowGuid`)
		  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='kgms_textdata_predicate')<1
     then
		  CREATE TABLE `kgms_textdata_predicate` (
		  `BelongXiaQuCode` varchar(50) DEFAULT NULL,
		  `OperateUserName` varchar(50) DEFAULT NULL,
		  `OperateDate` datetime DEFAULT NULL,
		  `Row_ID` int(11) DEFAULT NULL,
		  `YearFlag` varchar(4) DEFAULT NULL,
		  `RowGuid` varchar(50) NOT NULL,
		  `OperateUserGuid` varchar(50) DEFAULT NULL,
		  `OperateUserOUGuid` varchar(50) DEFAULT NULL,
		  `OperateUserBaseOUGuid` varchar(50) DEFAULT NULL,
		  `PVIGuid` varchar(50) DEFAULT NULL,
		  `textguid` varchar(50) DEFAULT NULL,
		  `predicatealias` varchar(200) DEFAULT NULL,
		  `predicatestr` varchar(500) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
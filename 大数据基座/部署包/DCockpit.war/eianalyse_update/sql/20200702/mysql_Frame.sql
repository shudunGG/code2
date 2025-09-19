-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_apply')<1
     then
            CREATE TABLE `portrait_tags_apply` (
            `rowguid` varchar(50) NOT NULL,
            `tagguid` varchar(50) NULL,
            `applytime` datetime NULL,
            `applyuser` varchar(50) NULL,
            `applyou` varchar(50) NULL,
            `status` int(10) NULL,
            `processversioninstanceguid` varchar(50) NULL ,
            PRIMARY KEY (`rowguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='my_portrait_tags_collect')<1
     then
            CREATE TABLE `my_portrait_tags_collect` (
            `rowguid`  varchar(50) NOT NULL ,
            `tagguid`  varchar(50) NULL ,
            `createtime`  datetime NULL ,
            `userguid`  varchar(50) NULL ,
            `ouguid`  varchar(50) NULL ,
            PRIMARY KEY (`rowguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='my_portrait_tags_up')<1
     then
            CREATE TABLE `my_portrait_tags_up` (
            `rowguid`  varchar(50) NOT NULL ,
            `tagguid`  varchar(50) NULL ,
            `createtime`  datetime NULL ,
            `userguid`  varchar(50) NULL ,
            `ouguid`  varchar(50) NULL ,
            PRIMARY KEY (`rowguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='my_portrait_tags_comments')<1
     then
            CREATE TABLE `my_portrait_tags_comments` (
            `rowguid`  varchar(50) NOT NULL ,
            `tagguid`  varchar(50) NULL ,
            `createtime`  datetime NULL ,
            `userguid`  varchar(50) NULL ,
            `ouguid`  varchar(50) NULL ,
            `score`  int(10) NULL ,
            `content`  varchar(500) NULL ,
            PRIMARY KEY (`rowguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_history_version')<1
     then
             CREATE TABLE `portrait_tags_history_version` (
              `BelongXiaQuCode` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
              `OperateUserName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
              `OperateDate` datetime DEFAULT NULL,
              `Row_ID` int(11) DEFAULT NULL,
              `portraitTagsGuid` varchar(50) DEFAULT NULL,
              `YearFlag` varchar(4) CHARACTER SET utf8 DEFAULT NULL,
              `RowGuid` varchar(50) CHARACTER SET utf8 NOT NULL,
              `tag_type` varchar(255) NOT NULL,
              `source` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
              `tags_table` varchar(255) DEFAULT NULL,
              `tags_sql` longtext,
              `compute_path` varchar(255) DEFAULT NULL,
              `extract_type` varchar(255) DEFAULT NULL,
              `selectedmainkey` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
              `selectedcodeitem` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
              `intelligencetype` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
              `connectionwithmaintable` varchar(255) DEFAULT NULL,
              `entity_guid` varchar(255) DEFAULT NULL,
              `first_guid` varchar(255) DEFAULT NULL,
              `featurelabel` varchar(500) DEFAULT NULL,
              `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
              `TAG_NAME` varchar(50) DEFAULT NULL,
              `matchingtype` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
              `fullSearch` varchar(50) DEFAULT NULL,
              `conditionSearch` varchar(50) DEFAULT NULL,
              `primekey_sql` varchar(255) DEFAULT NULL,
              `data_type` varchar(50) DEFAULT NULL,
              `TAG_ALIAS` varchar(50) NOT NULL,
              `resourcename` varchar(255) DEFAULT NULL,
              `tagweight` double(18,2) DEFAULT NULL,
              `auto_increment` varchar(50) DEFAULT NULL,
              `defaultvalue` varchar(50) DEFAULT NULL,
              `iskylindimension` varchar(1) DEFAULT NULL,
              `kylinmeasures` varchar(50) DEFAULT NULL,
              `issavecodevalue` varchar(1) DEFAULT NULL,
              `issetvalue` varchar(2) DEFAULT NULL,
              `fullSearchValue` varchar(50) DEFAULT NULL,
              `isdisable` varchar(50) DEFAULT NULL,
              `tag_value_type` varchar(2) DEFAULT NULL,
              `cycle_set` varchar(255) DEFAULT NULL,
              `time_mode` varchar(2) DEFAULT NULL,
              `rule_desc` varchar(2550) DEFAULT NULL,
              `tag_public` varchar(2) DEFAULT NULL,
              `create_user` varchar(50) DEFAULT NULL,
              `create_user_guid` varchar(50) DEFAULT NULL,
              `create_time` datetime DEFAULT NULL,
              `update_time` datetime DEFAULT NULL,
              `approval_status` varchar(10) DEFAULT NULL,
              `classification` varchar(50) DEFAULT NULL,
              `is_clear` varchar(2) DEFAULT NULL,
              `has_history` varchar(2) DEFAULT NULL,
              `time_to_live` int(11) DEFAULT NULL,
              `belongOuGuid` varchar(50) DEFAULT NULL,
              `enablingOuGuid` text,
              `operateType` int(11) DEFAULT NULL,
              `historyVersion` varchar(50) DEFAULT NULL,
              PRIMARY KEY (`RowGuid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO





-- DELIMITER ; --






drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_api_category')<1
     then
        CREATE TABLE `portrait_tags_api_category` (
            `rowguid` VARCHAR ( 50 ) COLLATE utf8_bin NOT NULL,
            `apicategoryname` VARCHAR ( 255 ) COLLATE utf8_bin DEFAULT NULL,
            `parentGuid` VARCHAR ( 50 ) COLLATE utf8_bin DEFAULT NULL,
            `level` VARCHAR ( 255 ) COLLATE utf8_bin DEFAULT NULL,
            `sort` INT ( 11 ) DEFAULT NULL,
            `createDatetime` datetime DEFAULT NULL,
            `updateDatetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY ( `rowguid` ) USING BTREE
        ) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_bin;
	 INSERT INTO `portrait_tags_api_category` VALUES ('4e026be2-a2aa-49f4-af1f-614070906a00', '平台开放服务', '', '4e026be2-a2aa-49f4-af1f-614070906a00', 0, '2020-06-23 15:37:54', '2020-06-23 15:38:17');
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
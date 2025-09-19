drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'zc_applyiteminfo')<1
     then
CREATE TABLE `zc_applyiteminfo` (
  `RowGuid` varchar(50) NOT NULL,
  `OperateDate` datetime DEFAULT NULL,
  `zcguid` varchar(50) DEFAULT NULL,
  `classifyName` varchar(50) DEFAULT NULL,
  `classifyNo` varchar(50) DEFAULT NULL,
  `applyitemName` varchar(50) DEFAULT NULL,
  `applyitemNo` varchar(50) DEFAULT NULL,
  `relatedmatter` varchar(50) DEFAULT NULL,
  `relatedmatterGuid` varchar(50) DEFAULT NULL,
  `portrait_guid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`RowGuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'zc_classifyinfo')<1
     then
CREATE TABLE `zc_classifyinfo` (
  `RowGuid` varchar(50) NOT NULL,
  `OperateDate` datetime DEFAULT NULL,
  `zcGuid` varchar(50) DEFAULT NULL,
  `classifyName` varchar(50) DEFAULT NULL,
  `classifyNo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`RowGuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'zc_info')<1
     then
CREATE TABLE `zc_info` (
  `rowGuid` varchar(50) NOT NULL,
  `lawGuid` varchar(50) DEFAULT NULL,
  `lawTitle` varchar(50) DEFAULT NULL,
  `lawNo` varchar(50) DEFAULT NULL,
  `publishTime` datetime DEFAULT NULL,
  `lawTheme` varchar(50) DEFAULT NULL,
  `applicableObject` varchar(50) DEFAULT NULL,
  `matchType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rowGuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
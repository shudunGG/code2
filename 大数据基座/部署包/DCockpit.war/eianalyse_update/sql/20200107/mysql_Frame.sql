-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tuk_task')<1 then
CREATE TABLE `portrait_tuk_task` (
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
  `taskname` varchar(255) DEFAULT NULL,
  `galleryguid` varchar(50) DEFAULT NULL,
  `time_mode` varchar(255) DEFAULT NULL,
  `error_log` varchar(255) DEFAULT NULL,
  `modelguid` varchar(255) DEFAULT NULL,
  `isconcurrent` varchar(50) DEFAULT NULL,
  `jobguid` varchar(255) DEFAULT NULL,
  `subjectguid` varchar(255) DEFAULT NULL,
  `tasktiming` varchar(50) DEFAULT NULL,
  `intervalMinutes` varchar(50) DEFAULT NULL,
  `intervalseconds` varchar(50) DEFAULT NULL,
  `isdisable` varchar(50) DEFAULT NULL,
  `hour` varchar(50) DEFAULT NULL,
  `minutes` varchar(50) DEFAULT NULL,
  `weekDay` varchar(50) DEFAULT NULL,
  `dayOfMonth` varchar(50) DEFAULT NULL,
  `relationguid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RowGuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
end if;
if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_relation' and column_name='galleryguid')<1 then
alter table portrait_relation add COLUMN galleryguid VARCHAR(100) DEFAULT NULL;
end if;
if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_relation' and column_name='type')<1 then
alter table portrait_relation add COLUMN type VARCHAR(20) DEFAULT NULL;
end if;
if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_manageinfo')<1 then
CREATE TABLE `portrait_manageinfo` (
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
  `gallerychinesename` varchar(50) DEFAULT NULL,
  `galleryname` varchar(50) DEFAULT NULL,
  `servicetype` varchar(10) DEFAULT NULL,
  `serviceaddress` varchar(50) DEFAULT NULL,
  `hbaseaddress` varchar(50) DEFAULT NULL,
  `esaddress` varchar(255) DEFAULT NULL,
  `portraitsubject` varchar(255) DEFAULT NULL,
  `portraitcategory` varchar(255) DEFAULT NULL,
  `fulltexthost` varchar(255) DEFAULT NULL,
  `createusername` varchar(50) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
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
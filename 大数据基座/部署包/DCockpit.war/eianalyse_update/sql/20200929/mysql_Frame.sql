-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'annotation_imagedata')<1
     then
CREATE TABLE `annotation_imagedata` (
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
  `name` varchar(500) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `labelcodeitem` varchar(50) DEFAULT NULL,
  `modelguid` varchar(50) DEFAULT NULL,
  `certificatetype` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`RowGuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'annotation_imagedata_detail')<1
     then
CREATE TABLE `annotation_imagedata_detail` (
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
  `dataguid` varchar(100) DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `attachguid` varchar(50) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  `content` longtext,
  `target` longtext,
  `target_hat` longtext,
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
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/27
-- 添加三员管理日志表 -- 俞俊男
if not exists (select * from dbo.sysobjects where id = object_id('frame_log_threemanage'))
create table frame_log_threemanage
   (
	  belongXiaQuCode varchar(50),
	  operateUsername varchar(50),
	  operateDate datetime,
	  row_id float,
	  yearFlag varchar(4),
	  rowguid varchar(50) not null primary key,
	  threadName varchar(100),
	  eventLevel varchar(50),
	  requestFilename varchar(100),
	  fromIp varchar(50),
	  loginId varchar(50),
	  userGuid varchar(50),
	  userName varchar(50),
	  pagePath varchar(200),
	  buttonName varchar(50),
	  pageParams varchar(200),
	  operator_type varchar(50),
	  methodName varchar(50),
	  subSystem_type varchar(50),
	  operateContent varchar(500),
	  operateContentBefore varchar(500),
	  operateTable varchar(50),
	  baseOuGuid varchar(50),
	  ouGuid varchar(50),
	  macAddress varchar(50),
	  recordDate datetime DEFAULT NULL,
	  userDisplayName varchar(50),
	  moduleGuid varchar(50),
	  modulecode varchar(50),
	  moduleName varchar(50),
	  moduleUrl varchar(200),
	  serviceName varchar(50),
	  serviceMethodName varchar(50),
	  procesStype varchar(50),
	  attachGuid varchar(50),
	  content varchar(500),
	  logType varchar(50),
	  line_no varchar(50)
    );
GO

-- frame_module增加IsReserved字段
-- 增加IsReserved字段
if not exists (select name from syscolumns  where id = object_id('frame_module') and name='IsReserved' ) 
 alter table frame_module add IsReserved int; 
GO

-- 增加三员管理日志模块记录 -- 俞俊男
if not exists(select moduleGuid from frame_module where moduleGuid = '2a071ee8-8caa-429a-83b6-2f0b9ed16bfe')
begin 
insert into frame_module (moduleGuid, moduleCode, moduleName, moudleMenuName, moduleUrl, orderNumber, isDisable, isBlank, bigIconAddress, SmallIconAddress, ModuleType, IsAddou, row_id, isfromsoa, IsUse, IsReserved)Values('2a071ee8-8caa-429a-83b6-2f0b9ed16bfe', 'SY000018', '三员管理操作日志', '', 'framemanager/log/query/threemanageoperationloglist?showtype=threemanage', '0', '0', '0', '', '', 'public', '0', NULL, NULL, NULL, '1');
end 
GO

-- frame_log添加tablename字段
-- 增加tablename字段
if not exists (select name from syscolumns  where id = object_id('frame_log') and name='tablename' ) 
 alter table frame_log add tablename varchar(50); 
GO
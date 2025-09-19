-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/08/27

-- 添加三员管理日志表 -- 俞俊男
create table if not exists frame_log_threemanage
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
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_module' and column_name = 'IsReserved') then
    alter table frame_module add column IsReserved int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 增加三员管理日志模块记录 -- 俞俊男
drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from frame_module where moduleGuid = '2a071ee8-8caa-429a-83b6-2f0b9ed16bfe') then
 insert into frame_module (moduleGuid, moduleCode, moduleName, moudleMenuName, moduleUrl, orderNumber, isDisable, isBlank, bigIconAddress, SmallIconAddress, ModuleType, IsAddou, row_id, isfromsoa, IsUse, IsReserved) 
  Values('2a071ee8-8caa-429a-83b6-2f0b9ed16bfe', 'SY000018', '三员管理操作日志', '', 'framemanager/log/query/threemanageoperationloglist?showtype=threemanage', '0', '0', '0', '', '', 'public', '0', NULL, NULL, NULL, '1') ;
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO

-- framelog增加tablename字段
-- 增加tablename字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_log' and column_name = 'tablename') then
    alter table frame_log add column tablename varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
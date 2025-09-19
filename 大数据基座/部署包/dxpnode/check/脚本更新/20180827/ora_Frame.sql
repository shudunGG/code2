-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/27
-- 添加三员管理日志表 -- 俞俊男
begin
 declare isexist number;
 begin
 select count(1) into isexist from user_tab_columns where table_name = upper('frame_log_threemanage');
 if (isexist = 0) then
 execute immediate '
 create table frame_log_threemanage
 (
  belongXiaQuCode varchar2(50),
  operateUsername varchar2(50),
  operateDate DATE,
  row_id float,
  yearFlag varchar2(4),
  rowguid varchar2(50) not null primary key,
  threadName varchar2(100),
  eventLevel varchar2(50),
  requestFilename varchar2(100),
  fromIp varchar2(50),
  loginId varchar2(50),
  userGuid varchar2(50),
  userName varchar2(50),
  pagePath varchar2(200),
  buttonName varchar2(50),
  pageParams varchar2(200),
  operator_type varchar2(50),
  methodName varchar2(50),
  subSystem_type varchar2(50),
  operateContent varchar2(500),
  operateContentBefore varchar2(500),
  operateTable varchar2(50),
  baseOuGuid varchar2(50),
  ouGuid varchar2(50),
  macAddress varchar2(50),
  recordDate date DEFAULT NULL,
  userDisplayName varchar(50),
  moduleGuid varchar2(50),
  modulecode varchar2(50),
  moduleName varchar2(50),
  moduleUrl varchar2(200),
  serviceName varchar2(50),
  serviceMethodName varchar2(50),
  procesStype varchar2(50),
  attachGuid varchar2(50),
  content varchar2(500),
  logType varchar2(50),
  line_no varchar2(50)
 )';
 end if;
 end;
end;
/* GO */

-- frame_module增加三员管理日志模块记录IsReserved字段 -- 俞俊男
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_module') and column_name = upper('IsReserved');
  if (isexist = 0) then
    execute immediate 'alter table frame_module add IsReserved  int';
  end if;
  end;
end;
/* GO */

-- 增加三员管理日志模块记录 -- 俞俊男
begin
begin
declare isexist number;
begin
select count(*) into isexist from frame_module where moduleGuid = '2a071ee8-8caa-429a-83b6-2f0b9ed16bfe';
if (IsExist=0) then
insert into frame_module (moduleGuid, moduleCode, moduleName, moudleMenuName, moduleUrl, orderNumber, isDisable, isBlank, bigIconAddress, SmallIconAddress, ModuleType, IsAddou, row_id, isfromsoa, IsUse, IsReserved) values
('2a071ee8-8caa-429a-83b6-2f0b9ed16bfe', 'SY000018', '三员管理操作日志', '', 'framemanager/log/query/threemanageoperationloglist?showtype=threemanage', '0', '0', '0', '', '', 'public', '0', NULL, NULL, NULL, '1');
 end if;
  end;
end;
commit;
end;
/* GO */

-- frame_log添加tablename字段
-- 增加tablename字段--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log') and column_name = upper('tablename');
  if (isexist = 0) then
    execute immediate 'alter table frame_log add tablename nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



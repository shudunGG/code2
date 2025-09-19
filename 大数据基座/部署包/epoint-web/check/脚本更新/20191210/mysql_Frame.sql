-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/12/10
-- 新增表api_runtime_alert_ops_log --【俞俊男】
-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype --【俞俊男】
-- 表api_runtime_alert_rule添加字段alertruletype --【俞俊男】

-- 添加表api_runtime_alert_ops_log
create table if not exists api_runtime_alert_ops_log
(
  rowguid nvarchar(50) not null primary key,
  fromip nvarchar(50),
  userguid nvarchar(50),
  operatortype nvarchar(50),
  operatecontent nvarchar(2000),
  displayname nvarchar(50),
  operatetime datetime,
  ruleGuid nvarchar(50)
);
GO


-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'messagetype') then
    alter table api_runtime_alert_info add column messagetype nvarchar(50);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'metric') then
    alter table api_runtime_alert_info add column metric nvarchar(100);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'rulename') then
    alter table api_runtime_alert_info add column rulename nvarchar(100);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'alerttype') then
    alter table api_runtime_alert_info add column alerttype nvarchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 表api_runtime_alert_rule添加字段alertruletype
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_rule' and column_name = 'alertruletype') then
    alter table api_runtime_alert_rule add column alertruletype int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
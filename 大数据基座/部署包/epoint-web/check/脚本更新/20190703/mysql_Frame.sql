-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/09【时间】
-- 添加表api_runtime_handle_rule --【陈端一】


-- 表api_runtime_alert_info添加和修改表字段
-- 表api_runtime_alert_rule添加字段ruletype
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_rule' and column_name = 'ruletype') then
    alter table api_runtime_alert_rule add column ruletype varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_rule' and column_name = 'handleruleguid') then
    alter table api_runtime_alert_rule add column handleruleguid varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'subjectguid') then
    alter table api_runtime_alert_info add column subjectguid varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'monitoringvalue') then
    alter table api_runtime_alert_info add column monitoringvalue varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'ruleid') then
    alter table api_runtime_alert_info add column ruleid varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'alertresult') then 
    alter table api_runtime_alert_info add  column alertresult VARCHAR(2000);   
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'alertsolution') then 
    alter table api_runtime_alert_info add  column alertsolution text;   
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'time') then 
    alter table api_runtime_alert_info change time recordtime datetime;   
end if;
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'decription') then 
    alter table api_runtime_alert_info change decription alertdecription VARCHAR(50);   
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'messagetype') then 
    alter table api_runtime_alert_info drop COLUMN messagetype;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_info' and column_name = 'alerttype') then 
    alter table api_runtime_alert_info drop COLUMN alerttype;
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 添加api_runtime_handle_rule处理规则表
create table if not exists api_runtime_handle_rule
(
  rowguid         varchar(50) not null primary key,
  rulename        varchar(100) not null,
  ruleID          varchar(100) not null,
  parentMenuGuid          varchar(50),
  handletype              int,
  enabled            varchar(11)
);
GO
-- DELIMITER ; --
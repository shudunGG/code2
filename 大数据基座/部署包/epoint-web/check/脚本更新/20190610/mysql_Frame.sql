-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/20 
-- workflow_processversion表添加baseouguid --季晓伟
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_processversion' and column_name = 'baseouguid') then
    alter table workflow_processversion add column baseouguid nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- workflow_activity_operation表添加baseouguid --季晓伟
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_activity_operation' and column_name = 'baseouguid') then
    alter table workflow_activity_operation add column baseouguid nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- workflow_participator表添加baseouguid --季晓伟
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_participator' and column_name = 'baseouguid') then
    alter table workflow_participator add column baseouguid nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- workflow_event表添加baseouguid --季晓伟
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_event' and column_name = 'baseouguid') then
    alter table workflow_event add column baseouguid nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2019/5/20
-- table_basicinfo、table_struct添加baseouguid字段 --【徐剑】

-- table_basicinfo添加baseouguid字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_basicinfo' and column_name = 'baseouguid') then
    alter table table_basicinfo add column baseouguid nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- table_struct添加baseouguid字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'baseouguid') then
    alter table table_struct add column baseouguid nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ;

-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/09
-- 添加表frame_schemetableshow表 parenttableid字段 --陈端一
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_schemetableshow' and column_name = 'parenttableid') then
    alter table frame_schemetableshow add column parenttableid int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 修改typename字段类型为varchar
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_method' and column_name = 'typename') then 
    alter table workflow_method add column typename varchar(500);
else 
    alter table workflow_method modify column typename varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改methodname字段类型为varchar
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_method' and column_name = 'methodname') then 
    alter table workflow_method add column methodname varchar(200);
else 
    alter table workflow_method modify column methodname varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
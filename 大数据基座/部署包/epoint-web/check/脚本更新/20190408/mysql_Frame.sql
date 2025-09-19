-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/04/08【时间】
-- api_info表添加字段funcNameSpace、funcPackageName、funcClassName --【俞俊男】


-- 添加字段funcNameSpace
drop procedure if exists`epoint_proc_alter`;
GO
create procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'funcNameSpace') then
    alter table api_info add column funcNameSpace nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段funcPackageName
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'funcPackageName') then
    alter table api_info add column funcPackageName nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段funcClassName
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'funcClassName') then
    alter table api_info add column funcClassName nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
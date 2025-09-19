-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/06/04


-- table_struct表新增DateFormatType字段 --季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'DateFormatType') then
    alter table table_struct add column DateFormatType varchar(20);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- table_struct表新增isFrameUser字段 --季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'isFrameUser') then
    alter table table_struct add column isFrameUser varchar(2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- table_struct表新增isFrameOu字段 --季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'isFrameOu') then
    alter table table_struct add column isFrameOu varchar(2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- tablebasicinfo表添加自定义addurl字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_basicinfo' and column_name = 'AddUrl') then
    alter table table_basicinfo add column AddUrl varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- tablebasicinfo表添加自定义editurl字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_basicinfo' and column_name = 'EditUrl') then
    alter table table_basicinfo add column EditUrl varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- tablebasicinfo表添加自定义detailurl字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_basicinfo' and column_name = 'DetailUrl') then
    alter table table_basicinfo add column DetailUrl varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 添加系统保留字段配置表table_systemstruct_config
create table if not exists table_systemstruct_config
(
     rowguid   varchar(100) not null primary key,
     tableid int,
     tablename varchar(100),
     sysfieldid  int,
     sysfieldname varchar(100)
);
GO

-- 添加子父表关联字段配置表table_fieldrelation_config
create table if not exists table_fieldrelation_config
(
     rowguid   varchar(100) not null primary key,
     maintableid int,
     maintablename varchar(100),
     mainfieldid  int,
     mainfieldname varchar(100),
     goaltableid int,
     goaltablename varchar(100),
     goalfieldid  int,
     goalfieldname varchar(100)
);
GO

-- DELIMITER ; --
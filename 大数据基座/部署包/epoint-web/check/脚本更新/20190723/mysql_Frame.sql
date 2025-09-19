-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/07/23【时间】
-- datasource表修改loginuser字段长度-- 孟佳佳
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'loginuser' and data_type = 'varchar' and character_maximum_length=1000) then
    alter table datasource modify loginuser varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- datasource表修改loginpwd字段长度-- 孟佳佳
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'loginpwd' and data_type = 'varchar' and character_maximum_length=1000) then
    alter table datasource modify loginpwd varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- datasource表修改servername字段长度-- 孟佳佳
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'servername' and data_type = 'varchar' and character_maximum_length=1000) then
    alter table datasource modify servername varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- datasource表修改dbname字段长度-- 孟佳佳
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'dbname' and data_type = 'varchar' and character_maximum_length=1000) then
    alter table datasource modify dbname varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- datasource表修改connectionstring字段长度-- 孟佳佳
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'connectionstring' and data_type = 'varchar' and character_maximum_length=2000) then
    alter table datasource modify connectionstring varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
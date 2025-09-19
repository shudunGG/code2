-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/10/16 【时间】
-- 添加表api_func_history、api_info_history --【俞俊男】
-- api_info_history添加字段version_number、related_apiguid --【俞俊男】
-- api_info添加字段online_version、version_number --【俞俊男】


-- 添加表api_func_history
create table if not exists api_func_history
(
  rowguid nvarchar(50) not null primary key,
  record_time datetime,
  func_namespace nvarchar(100),
  func_package_name nvarchar(100),
  func_class_name nvarchar(100),
  func_data text,
  apiguid nvarchar(100)
);
GO

-- 添加表api_info_history
create table if not exists api_info_history like api_info;
GO

-- api_info_history添加字段version_number
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info_history' and column_name = 'version_number') then
    alter table api_info_history add column version_number nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- api_info_history添加字段related_apiguid
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info_history' and column_name = 'related_apiguid') then
    alter table api_info_history add column related_apiguid nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- api_info添加字段online_version
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'online_version') then
    alter table api_info add column online_version nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- api_info添加字段version_number
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'version_number') then
    alter table api_info add column version_number nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
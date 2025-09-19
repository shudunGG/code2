-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/08/01
-- frameMyAddressGroup、frame_myaddressgroup_snapshot添加appguid,isfilter字段,删除ouguids字段 --季立霞
-- frameMyAddressBook、frame_myaddressbook_snapshot添加row_id字段  --季立霞

-- 删除ouguids字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressGroup' and column_name = 'ouguids') then
    alter table Frame_MyAddressGroup drop column ouguids;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加appguid字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressGroup' and column_name = 'appguid') then
    alter table Frame_MyAddressGroup add column appguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加isfilter字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressGroup' and column_name = 'isfilter') then
    alter table Frame_MyAddressGroup add column isfilter varchar(4);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加framemyaddressbook表添加row_id字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_myaddressbook' and column_name = 'row_id') then
    alter table Frame_MyAddressBook add column row_id INT;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 快照表删除ouguids字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_myaddressgroup_snapshot' and column_name = 'ouguids') then
    alter table frame_myaddressgroup_snapshot drop column ouguids;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 快照表添加appguid字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_myaddressgroup_snapshot' and column_name = 'appguid') then
    alter table frame_myaddressgroup_snapshot add column appguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 快照表添加isfilter字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_myaddressgroup_snapshot' and column_name = 'isfilter') then
    alter table frame_myaddressgroup_snapshot add column isfilter varchar(4);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 添加framemyaddressbook快照表添加row_id字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_myaddressbook_snapshot' and column_name = 'row_id') then
    alter table frame_myaddressbook_snapshot add column row_id INT;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
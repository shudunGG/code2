-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2017/10/20 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 添加表
create table if not exists tablename
(
  columnname1              nvarchar(50) not null primary key,
  columnname2           nvarchar(50)
);
GO

-- 删除表
drop table if exists epointsform_table_category;
GO

-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'tablename' and column_name = 'columnname') then
    alter table tablename add column columnname nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'tablename' and column_name = 'columnname') then 
    alter table tablename add column columnname varchar(2000);
else 
    alter table tablename modify column columnname varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改字段长度示例
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'tablename' and column_name = 'columnname' and data_type = 'varchar' and character_maximum_length=200) then
    alter table tablename modify columnname varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
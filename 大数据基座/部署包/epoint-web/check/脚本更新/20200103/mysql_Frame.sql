-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2020/2/6 补充
-- 修改APPROOTURL字段长度示例
-- app_info表的字符集utf8mb4，限制了总表的varchar字段的总长度，导致appsecret的长度无法被修改。
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'APPROOTURL' and data_type = 'varchar' and character_maximum_length=500) then
    alter table app_info modify APPROOTURL varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2020/01/03 
-- 修改appsecret字段长度示例
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'appsecret' and data_type = 'varchar' and character_maximum_length=500) then
    alter table app_info modify appsecret varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
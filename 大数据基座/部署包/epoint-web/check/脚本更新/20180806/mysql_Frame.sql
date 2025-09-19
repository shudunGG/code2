-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/08/06【时间】
-- app_info表添加issyncrole,issyncaddress字段-- 樊志君

-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'issyncrole') then
    alter table app_info add column issyncrole int default 0;
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'issyncaddress') then 
    alter table app_info add column issyncaddress int default 0;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
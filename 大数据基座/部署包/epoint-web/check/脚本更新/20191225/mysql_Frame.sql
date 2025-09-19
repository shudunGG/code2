-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/10/24
-- 【datasource添加字段smartbisid，同步SmartBI数据源，用于存sid】 --【季海英】


-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'smartbisid') then
    alter table datasource add column smartbisid nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

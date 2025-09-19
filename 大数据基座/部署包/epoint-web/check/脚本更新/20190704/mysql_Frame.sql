-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/07/04【时间】
-- 添加表epointformversion --【薛炳】


-- 表epointformversion添加字段htmlData
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointformversion' and column_name = 'htmlData') then
    alter table epointformversion add column htmlData TEXT;
end if;


end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



 
-- DELIMITER ; --
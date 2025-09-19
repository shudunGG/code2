-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/1/15
-- workflow_transition表IS_SHOWOVERTIMEPOINT字段改为int类型 -- 徐剑

-- 修改字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_transition' and column_name = 'IS_SHOWOVERTIMEPOINT') then 
    alter table workflow_transition add column IS_SHOWOVERTIMEPOINT int;
else 
    alter table workflow_transition modify column IS_SHOWOVERTIMEPOINT int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
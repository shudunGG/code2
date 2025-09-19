-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/16
-- 修改workflow_workitem_history中ACTIVITYNAME字段长度 -- cdy
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_workitem_history' and column_name = 'ACTIVITYNAME' and data_type = 'varchar' and character_maximum_length=250) then
    alter table workflow_workitem_history modify ACTIVITYNAME varchar(250);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
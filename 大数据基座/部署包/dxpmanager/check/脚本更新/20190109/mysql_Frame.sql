-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/01/01 【时间】
-- 【内容简单介绍】 --【添加人姓名】
-- 触发器配置增加执行方式配置，可以选配触发器自动或手动执行，不配默认使用frame_task_msg的配置--严璐琛
-- 添加字段

-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_task_trig' and column_name = 'executetype') then
    alter table frame_task_trig add column executetype int(11);
    update frame_task_trig set executetype = 1 where taskguid in (select rowguid from frame_task_msg where executetype = 1);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
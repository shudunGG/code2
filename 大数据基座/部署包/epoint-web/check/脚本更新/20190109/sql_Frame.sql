-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/01/01 【时间】
-- 【内容简单介绍】 --【添加人姓名】
-- 触发器配置增加执行方式配置，可以选配触发器自动或手动执行，不配默认使用frame_task_msg的配置--严璐琛
-- 添加字段
if not exists (select name from syscolumns  where id = object_id('frame_task_trig') and name='executetype' ) 
alter table frame_task_trig add executetype int;
GO
update frame_task_trig set executetype = 1 where taskguid in (select rowguid from frame_task_msg where executetype = 1);
GO

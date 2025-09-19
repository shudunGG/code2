-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/15 【时间】
-- 修改workflow_workitem_history中ACTIVITYNAME字段长度 -- cdy
if not exists (select * from information_schema.columns  where  table_name = 'workflow_workitem_history' and column_name='ACTIVITYNAME'  and character_maximum_length=250) 
alter table workflow_workitem_history 
alter column ACTIVITYNAME varchar(250);  
GO
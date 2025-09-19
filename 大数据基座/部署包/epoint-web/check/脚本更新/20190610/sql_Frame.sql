-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/20 
-- workflow_processversion表添加baseouguid --季晓伟
if not exists (select * from information_schema.columns  where  table_name = 'workflow_processversion' and column_name='baseouguid') 
alter table workflow_processversion add baseouguid nvarchar(100); 
GO

-- workflow_activity_operation表添加baseouguid --季晓伟
if not exists (select * from information_schema.columns  where  table_name = 'workflow_activity_operation' and column_name='baseouguid') 
alter table workflow_activity_operation add baseouguid nvarchar(100); 
GO

-- workflow_participator表添加baseouguid --季晓伟
if not exists (select * from information_schema.columns  where  table_name = 'workflow_participator' and column_name='baseouguid') 
alter table workflow_participator add baseouguid nvarchar(100); 
GO

-- workflow_event表添加baseouguid --季晓伟
if not exists (select * from information_schema.columns  where  table_name = 'workflow_event' and column_name='baseouguid') 
alter table workflow_event add baseouguid nvarchar(100); 
GO

-- 2019/5/20
-- table_basicinfo、table_struct添加baseouguid字段 --【徐剑】

-- table_basicinfo添加baseouguid字段
if not exists (select name from syscolumns  where id = object_id('table_basicinfo') and name='baseouguid' ) 
alter table table_basicinfo add baseouguid  nvarchar(50); 
GO

-- table_struct添加baseouguid字段
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='baseouguid' ) 
alter table table_struct add baseouguid  nvarchar(50); 
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 【修改用户表的密码字段长度】 --【cdy】
-- 【修改用户快照表的密码字段长度】 --【cdy】

if not exists (select * from information_schema.columns  where  table_name = 'frame_user' and column_name='password' and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_user 
alter column password nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_user_snapshot' and column_name='password' and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_user_snapshot 
alter column password nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'workflow_process' and column_name='processname' and data_type='nvarchar' and character_maximum_length=2000) 
alter table workflow_process 
alter column processname nvarchar(2000);  
GO

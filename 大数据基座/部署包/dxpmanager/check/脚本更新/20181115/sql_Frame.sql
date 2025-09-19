-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/11/15
-- BELONGUSERGUID、BELONGDISPLAYNAM字段长度增长
if not exists (select * from information_schema.columns  where  table_name = 'frame_job' and column_name='BELONGUSERGUID' and data_type='NVARCHAR' and character_maximum_length=2000) 
alter table frame_job 
alter column BELONGUSERGUID nvarchar(2000);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_job' and column_name='BELONGDISPLAYNAME' and data_type='NVARCHAR' and character_maximum_length=2000) 
alter table frame_job 
alter column BELONGDISPLAYNAME nvarchar(2000);  
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/01/13 【时间】
--添加OPERATECONTENT，CONTENT字段长度 --周志豪

-- 修改字段示例
if not exists (select * from information_schema.columns  where  table_name = 'frame_log' and column_name='CONTENT' and data_type='nvarchar' and character_maximum_length=2000) 
alter table frame_log 
alter column CONTENT nvarchar(2000);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_log' and column_name='OPERATECONTENT' and data_type='nvarchar' and character_maximum_length=2000) 
alter table frame_log 
alter column OPERATECONTENT nvarchar(2000);  
GO
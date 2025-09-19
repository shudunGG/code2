-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/05 【时间】
-- 修改frame_log中content字段长度 -- cdy
if not exists (select * from information_schema.columns  where  table_name = 'frame_log' and column_name='content' and data_type='nvarchar' and character_maximum_length=2000) 
alter table frame_log 
alter column content nvarchar(2000);  
GO


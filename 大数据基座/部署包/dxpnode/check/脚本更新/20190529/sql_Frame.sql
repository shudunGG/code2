-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/15 【时间】
-- 修改frame_exttabsconfig中exturl字段长度 -- hexy
if not exists (select * from information_schema.columns  where  table_name = 'frame_exttabsconfig' and column_name='exturl' and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_exttabsconfig 
alter column exturl nvarchar(200);  
GO
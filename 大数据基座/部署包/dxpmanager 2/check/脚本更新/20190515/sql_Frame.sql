-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/15 【时间】
-- 修改api_info中apirealurl字段长度 -- cdy
if not exists (select * from information_schema.columns  where  table_name = 'api_info' and column_name='apirealurl' and data_type='nvarchar' and character_maximum_length=200) 
alter table api_info 
alter column apirealurl nvarchar(200);  
GO
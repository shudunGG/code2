-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/5/9
-- 修改分库分表的表字段shardingrule的长度 --wy
if not exists (select * from information_schema.columns  where  table_name = 'frame_sharding' and column_name='shardingrule' and data_type='nvarchar' and character_maximum_length=1000) 
alter table frame_sharding 
alter column shardingrule nvarchar(1000);  
GO
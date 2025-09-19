-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/03/26 【时间】
-- 修改app_element中elementurl字段长度 -- 王颜
if not exists (select * from information_schema.columns  where  table_name = 'app_element' and column_name='elementurl' and data_type='nvarchar' and character_maximum_length=200) 
alter table app_element 
alter column elementurl nvarchar(200);  
GO

-- frame_userrole_snapshot表的row_id字段设置可为null--王露

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'row_id' and IS_NULLABLE='NO') 
ALTER TABLE frame_userrole_snapshot ALTER COLUMN row_id int null;
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/12/26 陈端一

if exists (select * from information_schema.columns  where  table_name = 'frame_userrole_snapshot' and column_name='row_id' and data_type='int' and IS_NULLABLE = 'NO') 
alter table frame_userrole_snapshot 
alter column row_id int null;  
GO




-- 所有脚本可直接复制到sql server查询设计器中执行

-- frame_user表row_id字段为空
if not exists (select * from information_schema.columns  where  table_name = 'frame_user' and column_name='row_id'  and IS_NULLABLE = 'YES') 
alter table frame_user 
alter column row_id int null;  
GO


-- 所有脚本可直接复制到sql server查询设计器中执行
-- api_info表urlpattern字段为空

if not exists (select * from information_schema.columns  where  table_name = 'api_info' and column_name='urlpattern'  and IS_NULLABLE = 'YES') 
alter table api_info 
alter column urlpattern nvarchar null;  
GO




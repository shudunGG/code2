-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/12/19
-- 修改字段querytext的长度 --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'tablelist_searchareaconfig' and column_name='querytext'  and character_maximum_length=100) 
alter table tablelist_searchareaconfig 
alter column querytext nvarchar(100);  
GO

 

-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/12/11 --【薛炳】
-- 修改表单版本JsContent字段类型改为longtext
if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'JsContent' and data_type='text') 
alter table epointformversion 
alter column JsContent text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'Content' and data_type='text') 
alter table epointformversion 
alter column Content text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'CssContent' and data_type='text') 
alter table epointformversion 
alter column CssContent text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'JsonData' and data_type='text') 
alter table epointformversion 
alter column JsonData text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'controlsData' and data_type='text') 
alter table epointformversion 
alter column controlsData text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'epointformversion' and column_name = 'htmlData' and data_type='text') 
alter table epointformversion 
alter column htmlData text; 
GO
-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/07/24--【薛炳】

-- 修改table_basicinfo表mergeformids字段类型改为longtext
if not exists (select * from information_schema.columns where  table_name = 'table_basicinfo' and column_name = 'mergeformids' and data_type='text') 
alter table epointformversion 
alter column mergeformids text; 
GO


if not exists (select * from information_schema.columns where  table_name = 'epointsform_tablerelation' and column_name = 'businesstableid' and data_type='text') 
alter table epointsform_tablerelation 
alter column businesstableid text; 
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/02/10
-- 表单版本表中增加表单类型字段 --【薛炳】
 
-- Epointsform表添加formtype
if not exists (select * from information_schema.columns  where  table_name = 'Epointsform' and column_name='formtype') 
alter table Epointsform add formtype nvarchar(20); 
GO

-- Epointsform表添加tablesource
if not exists (select * from information_schema.columns  where  table_name = 'Epointsform' and column_name='tablesource') 
alter table Epointsform add tablesource nvarchar(20); 
GO

-- epointsform_tablerelation表添加sharefielddata
if not exists (select * from information_schema.columns  where  table_name = 'epointsform_tablerelation' and column_name='sharefielddata') 
alter table epointsform_tablerelation add sharefielddata text; 
GO



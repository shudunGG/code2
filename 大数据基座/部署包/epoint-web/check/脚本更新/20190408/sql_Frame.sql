-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/04/08【时间】
-- api_info表添加字段funcNameSpace、funcPackageName、funcClassName --【俞俊男】


-- 添加字段funcNameSpace
if not exists (select name from syscolumns  where id = object_id('api_info') and name='funcNameSpace' ) 
alter table api_info add funcNameSpace  nvarchar(100); 
GO

-- 添加字段funcPackageName
if not exists (select name from syscolumns  where id = object_id('api_info') and name='funcPackageName' ) 
alter table api_info add funcPackageName  nvarchar(100); 
GO

-- 添加字段funcClassName
if not exists (select name from syscolumns  where id = object_id('api_info') and name='funcClassName' ) 
alter table api_info add funcClassName  nvarchar(100); 
GO
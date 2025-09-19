-- 所有脚本可直接复制到sql server查询设计器中执行

-- 删除表EpointsformTemplate字段 --【薛炳】
if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='classpath') 
alter table EpointsformTemplate drop column classpath;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='methodname') 
alter table EpointsformTemplate drop column methodname;  
GO
if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='treeTitle') 
alter table EpointsformTemplate drop column treeTitle;  
GO

if not exists (select name from syscolumns  where id = object_id('EpointsformListVersion') and name='classpath' ) 
alter table EpointsformListVersion add classpath  nvarchar(200); 
GO

if not exists (select name from syscolumns  where id = object_id('EpointsformListVersion') and name='methodname' ) 
alter table EpointsformListVersion add methodname  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('EpointsformListVersion') and name='treetitle' ) 
alter table EpointsformListVersion add treetitle  nvarchar(100); 
GO

 
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/14
-- app_info表修改callbackurl字段长度 --周志豪
if not exists (select * from information_schema.columns  where  table_name = 'app_info' and column_name='callbackurl' and data_type='nvarchar' and character_maximum_length=2000) 
alter table app_info 
alter column callbackurl nvarchar(2000);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'app_info' and column_name='scope' and data_type='nvarchar' and character_maximum_length=500) 
alter table app_info 
alter column scope nvarchar(500);  
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='verificationtype' ) 
alter table app_info add verificationtype  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='serverurl' ) 
alter table app_info add serverurl  nvarchar(2000); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='serverintraneturl' ) 
alter table app_info add serverintraneturl  nvarchar(500); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='redirectintraneturl' ) 
alter table app_info add redirectintraneturl  nvarchar(500); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='display' ) 
alter table app_info add display  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='ssoenabled' ) 
alter table app_info add ssoenabled  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='intefaceproject' ) 
alter table app_info add intefaceproject  nvarchar(50); 
GO
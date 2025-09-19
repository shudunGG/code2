-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2017/10/20 【时间】
-- 【内容简单介绍】 --【添加人姓名】
if not exists (select * from information_schema.columns  where  table_name = 'frame_ou_extendinfo' and column_name='INDIVIDUATIONIMGPATH' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_ou_extendinfo 
alter column INDIVIDUATIONIMGPATH nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_ou_e_snapshot' and column_name='INDIVIDUATIONIMGPATH' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_ou_e_snapshot 
alter column INDIVIDUATIONIMGPATH nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='ATTACHFILENAME' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachinfo 
alter column ATTACHFILENAME nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='CONTENTTYPE' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachinfo 
alter column CONTENTTYPE nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='CLIENGTAG' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachinfo 
alter column CLIENGTAG nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='CLIENGINFO' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachinfo 
alter column CLIENGINFO nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='FILEPATH' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_attachinfo 
alter column FILEPATH nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachstorage' and column_name='CONTENTTYPE' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachstorage 
alter column CONTENTTYPE nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachstorage' and column_name='CLIENGTAG' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_attachstorage 
alter column CLIENGTAG nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'onlinemessage_info' and column_name='NOTE' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table onlinemessage_info 
alter column NOTE nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'code_items' and column_name='itemtext' 
and data_type='nvarchar' and character_maximum_length=100) 
alter table code_items 
alter column itemtext nvarchar(100);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='dbname' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table datasource 
alter column dbname nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='connectionstring' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table datasource 
alter column connectionstring nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_config' and column_name='CONFIGVALUE' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_config 
alter column CONFIGVALUE nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_config_category' and column_name='CATEGORYDES' 
and data_type='nvarchar' and character_maximum_length=200) 
alter table frame_config_category 
alter column CATEGORYDES nvarchar(200);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_quicklink' and column_name='LINKURL' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_quicklink 
alter column LINKURL nvarchar(500);  
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_quicklink_user' and column_name='LINKURL' 
and data_type='nvarchar' and character_maximum_length=500) 
alter table frame_quicklink_user 
alter column LINKURL nvarchar(500);  
GO



-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/23【时间】
-- datasource表修改loginuser字段长度-- 孟佳佳
if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='loginuser' and data_type='nvarchar' and character_maximum_length=1000) 
alter table datasource 
alter column loginuser nvarchar(1000);  
GO

-- datasource表修改loginpwd字段长度-- 孟佳佳
if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='loginpwd' and data_type='nvarchar' and character_maximum_length=1000) 
alter table datasource 
alter column loginpwd nvarchar(1000);  
GO

-- datasource表修改servername字段长度-- 孟佳佳
if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='servername' and data_type='nvarchar' and character_maximum_length=1000) 
alter table datasource 
alter column servername nvarchar(1000);  
GO

-- datasource表修改dbname字段长度-- 孟佳佳
if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='dbname' and data_type='nvarchar' and character_maximum_length=1000) 
alter table datasource 
alter column dbname nvarchar(1000);  
GO

-- datasource表修改connectionstring字段长度-- 孟佳佳
if not exists (select * from information_schema.columns  where  table_name = 'datasource' and column_name='connectionstring' and data_type='nvarchar' and character_maximum_length=2000) 
alter table datasource 
alter column connectionstring nvarchar(2000);  
GO

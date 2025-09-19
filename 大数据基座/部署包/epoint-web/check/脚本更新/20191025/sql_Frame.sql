-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/10/16 【时间】
-- 添加表api_func_history、api_info_history --【俞俊男】
-- api_info_history添加字段version_number、related_apiguid --【俞俊男】
-- api_info添加字段online_version、version_number --【俞俊男】

-- 添加表api_func_history
if not exists (select * from dbo.sysobjects where id = object_id('api_func_history'))
create table api_func_history
   (
    rowguid nvarchar(50) not null primary key,
	record_time datetime,
	func_namespace nvarchar(100),
	func_package_name nvarchar(100),
	func_class_name nvarchar(100),
	func_data text,
	apiguid nvarchar(100)
    );
GO

-- 添加表api_info_history
if  exists (select * from dbo.sysobjects where id = object_id('api_info'))
if  not exists (select * from dbo.sysobjects where id = object_id('api_info_history'))
select * into api_info_history from api_info where 1=2 
GO

-- api_info_history添加字段version_number
if not exists (select name from syscolumns  where id = object_id('api_info_history') and name='version_number' ) 
alter table api_info_history add version_number  nvarchar(100); 
GO

-- api_info_history添加字段related_apiguid
if not exists (select name from syscolumns  where id = object_id('api_info_history') and name='related_apiguid' ) 
alter table api_info_history add related_apiguid  nvarchar(50); 
GO

-- api_info添加字段online_version
if not exists (select name from syscolumns  where id = object_id('api_info') and name='online_version' ) 
alter table api_info add online_version  nvarchar(100); 
GO

-- api_info添加字段version_number
if not exists (select name from syscolumns  where id = object_id('api_info') and name='version_number' ) 
alter table api_info add version_number  nvarchar(100); 
GO


-- 所有脚本可直接复制到sql server查询设计器中执行

-- platform_hotspot表添加hotspottype字段 -- 俞俊男

if not exists (select name from syscolumns  where id = object_id('platform_hotspot') and name='hotspottype' ) 
alter table platform_hotspot add hotspottype  int; 
GO

-- 开放平台客户端配置管理数据表添加 -- 俞俊男
-- 添加客户端配置表
if not exists (select * from dbo.sysobjects where id = object_id('platform_client_config'))
create table platform_client_config
   (
    configGuid  nvarchar(100) NOT NULL primary key,
    configName  nvarchar(100) NOT NULL ,
	configValue  nvarchar(500) NOT NULL ,
	configDesc  text NULL ,
	clientVersion  nvarchar(100) NOT NULL ,
	creatorGuid  nvarchar(100) NOT NULL ,
	updaterGuid  nvarchar(100) NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL
    );
GO

-- 添加客户端版本表
if not exists (select * from dbo.sysobjects where id = object_id('platform_client_version'))
create table platform_client_version
   (
    versionGuid  nvarchar(100) NOT NULL primary key,
	clientVersion  nvarchar(100) NOT NULL ,
	clientOsType  int NOT NULL ,
	versionDesc  text NULL ,
	creatorGuid  nvarchar(100) NOT NULL ,
	updaterGuid  nvarchar(100) NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL
    );
GO
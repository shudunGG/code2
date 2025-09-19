-- 所有脚本可直接复制到sql server查询设计器中执行
-- 开放平台数据表添加 -- 俞俊男

-- 添加平台用户表
if not exists (select * from dbo.sysobjects where id = object_id('platform_user'))
create table platform_user
   (
    userGuid  nvarchar(100) NOT NULL primary key,
    loginId  nvarchar(100) NOT NULL ,
	displayName  nvarchar(100) NULL ,
	password  nvarchar(100) NULL ,
	mobile  nvarchar(100) NULL ,
	companyGuid  nvarchar(100) NULL ,
	userType  int NOT NULL ,
	userStatus  int NOT NULL ,
	submitTime  datetime NOT NULL ,
	auditTime  datetime NULL ,
	auditorGuid  nvarchar(100) NULL ,
	auditDesc  nvarchar(500) NULL ,
	lastLoginTime  datetime NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL
    );
GO

-- 添加APP用户表
if not exists (select * from dbo.sysobjects where id = object_id('platform_app_user'))
create table platform_app_user
   (
    userGuid  nvarchar(100) NOT NULL primary key,
	loginId  nvarchar(100) NULL ,
	displayName  nvarchar(100) NULL ,
	realName  nvarchar(100) NULL ,
	password  nvarchar(100) NOT NULL ,
	userImage  image NULL ,
	imageType nvarchar(20) NULL ,
	userStatus  int NOT NULL ,
	mobile  nvarchar(100) NOT NULL ,
	idCard  nvarchar(100) NULL ,
	verifiedLevel  int NOT NULL ,
	email  nvarchar(100) NULL ,
	address  nvarchar(200) NULL ,
	postcode  nvarchar(50) NULL ,
	areaCode  nvarchar(100) NULL ,
	areaName  nvarchar(100) NULL ,
	cityName  nvarchar(100) NULL ,
	postAddress  text NULL ,
	alipayUserId  nvarchar(100) NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL
    );
GO

-- 添加企业表
if not exists (select * from dbo.sysobjects where id = object_id('platform_company'))
create table platform_company
   (
    companyGuid  nvarchar(100) NOT NULL primary key,
	companyName  nvarchar(100) NOT NULL ,
	industryCategory  nvarchar(100) NOT NULL ,
	scale  nvarchar(50) NULL ,
	companyStatus  int NOT NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL
    );
GO

-- 添加信息表
if not exists (select * from dbo.sysobjects where id = object_id('platform_news'))
create table platform_news
   (
    newsGuid  nvarchar(100) NOT NULL primary key,
	title  nvarchar(100) NOT NULL ,
	newsContent  text NOT NULL ,
	outline  nvarchar(100) NOT NULL ,
	orderNumber  int NOT NULL ,
	codeId  nvarchar(100) NULL ,
	isReleased  int NOT NULL ,
	newsType  int NOT NULL ,
	url  nvarchar(200) NULL ,
	areaCode  nvarchar(100) NULL ,
	creatorGuid  nvarchar(100) NOT NULL ,
	releaseTime  datetime NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
    );
GO

-- 添加用户信息表
if not exists (select * from dbo.sysobjects where id = object_id('platform_user_news'))
create table platform_user_news
   (
    userNewsGuid  nvarchar(100) NOT NULL primary key ,
	title  nvarchar(100) NOT NULL ,
	outline  nvarchar(100) NOT NULL ,
	newsContent  nvarchar(500) NOT NULL ,
	orderNumber  int NOT NULL ,
	userGuid nvarchar(100) NOT NULL ,
	isRead  int NOT NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL 
    );
GO

-- 添加应用订阅表
if not exists (select * from dbo.sysobjects where id = object_id('platform_app_subscribe'))
create table platform_app_subscribe
   (
    rowGuid  nvarchar(100) NOT NULL primary key ,
	appGuid  nvarchar(100) NOT NULL ,
	appUserGuid  nvarchar(100) NOT NULL ,
	orderNumber  int NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
    );
GO

-- 添加应用反馈表
if not exists (select * from dbo.sysobjects where id = object_id('platform_app_feedback'))
create table platform_app_feedback
   (
	rowGuid  varchar(100) NOT NULL primary key ,
    appGuid  nvarchar(100) NOT NULL ,
	appUserGuid  nvarchar(100) NOT NULL ,
	feedback  nvarchar(200) NULL ,
	rateLevel  int NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
    );
GO

-- 添加应用访问记录表
if not exists (select * from dbo.sysobjects where id = object_id('platform_app_access_log'))
create table platform_app_access_log
   (
	rowGuid  varchar(100) NOT NULL primary key ,
    appGuid  nvarchar(100) NOT NULL ,
	appUserGuid  nvarchar(100) NOT NULL ,
	clientOsType  int NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NULL
    );
GO

-- 添加搜索关键词表
if not exists (select * from dbo.sysobjects where id = object_id('platform_hotspot'))
create table platform_hotspot
   (
	rowGuid  varchar(100) NOT NULL primary key ,
    searchContent  nvarchar(100) NULL ,
	areacode  nvarchar(50) NULL ,
	rate  int NULL
    );
GO

-- app_info添加字段
if not exists (select name from syscolumns  where id = object_id('app_info') and name='developverGuid' ) 
alter table app_info add developverGuid  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='versionNumber' ) 
alter table app_info add versionNumber  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='pcIndexUrl' ) 
alter table app_info add pcIndexUrl  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='releaseDistrictCodeId' ) 
alter table app_info add releaseDistrictCodeId  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='allowDistrictCodeId' ) 
alter table app_info add allowDistrictCodeId  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='releaseTime' ) 
alter table app_info add releaseTime  datetime; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='removeTime' ) 
alter table app_info add removeTime  datetime; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='removeDesc' ) 
alter table app_info add removeDesc  nvarchar(200); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='subscribeNumber' ) 
alter table app_info add subscribeNumber int; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='rateLevel' ) 
alter table app_info add rateLevel int; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='submitTime' ) 
alter table app_info add submitTime datetime; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='auditTime' ) 
alter table app_info add auditTime datetime; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='auditorGuid' ) 
alter table app_info add auditorGuid nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='auditDesc' ) 
alter table app_info add auditDesc nvarchar(500); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='serviceType' ) 
alter table app_info add serviceType nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='servicePhoneNumber' ) 
alter table app_info add servicePhoneNumber nvarchar(100); 
GO


-- messages_center和messages_center_histroy表添加appkey字段 --徐剑

if not exists (select name from syscolumns  where id = object_id('messages_center') and name='appkey' ) 
alter table messages_center add appkey  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('messages_center_histroy') and name='appkey' ) 
alter table messages_center_histroy add appkey  nvarchar(50); 
GO
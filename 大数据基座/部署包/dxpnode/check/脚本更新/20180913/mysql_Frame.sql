-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 开放平台数据表添加 --俞俊男

-- 添加平台用户表
create table if not exists platform_user
(
    userGuid  varchar(100) NOT NULL primary key,
    loginId  varchar(100) NOT NULL ,
	displayName  varchar(100) NULL ,
	password  varchar(100) NULL ,
	mobile  varchar(100) NULL ,
	companyGuid  varchar(100) NULL ,
	userType  int NOT NULL ,
	userStatus  int NOT NULL ,
	submitTime  datetime NOT NULL ,
	auditTime  datetime NULL ,
	auditorGuid  varchar(100) NULL ,
	auditDesc  varchar(500) NULL ,
	lastLoginTime  datetime NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
);
GO

-- 添加APP用户表
create table if not exists platform_app_user
(
    userGuid  varchar(100) NOT NULL primary key,
	loginId  varchar(100) NULL ,
	displayName  varchar(100) NULL ,
	realName varchar(100) NULL ,
	password  varchar(100) NOT NULL ,
	userImage longblob NULL ,
	imageType varchar(20) NULL ,
	userStatus  int NOT NULL ,
	mobile  varchar(100) NOT NULL ,
	idCard  varchar(100) NULL ,
	verifiedLevel  int NOT NULL ,
	email  varchar(100) NULL ,
	address  varchar(200) NULL ,
	postcode  varchar(50) NULL ,
	areaCode  varchar(100) NULL ,
	areaName  varchar(100) NULL ,
	cityName  varchar(100) NULL ,
	postAddress  text NULL ,
	alipayUserId  varchar(100) NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL 
);
GO

-- 添加企业表
create table if not exists platform_company
(
    companyGuid  varchar(100) NOT NULL primary key,
	companyName  varchar(100) NOT NULL ,
	industryCategory  varchar(100) NOT NULL ,
	scale  varchar(50) NULL ,
	companyStatus  int NOT NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL 
);
GO

-- 添加信息表
create table if not exists platform_news
(
    newsGuid  varchar(100) NOT NULL primary key,
	title  varchar(100) NOT NULL ,
	newsContent  text NOT NULL ,
	outline  varchar(100) NOT NULL ,
	orderNumber  int NOT NULL ,
	codeId  varchar(100) NULL ,
	isReleased  int NOT NULL ,
	newsType  int NOT NULL ,
	url  varchar(200) NULL ,
	areaCode  varchar(100) NULL ,
	creatorGuid  varchar(100) NOT NULL ,
	releaseTime  datetime NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL  
);
GO

-- 添加用户信息表
create table if not exists platform_user_news
(
	userNewsGuid  varchar(100) NOT NULL primary key ,
	title  varchar(100) NOT NULL ,
	outline  varchar(100) NOT NULL ,
	newsContent  varchar(500) NOT NULL ,
	orderNumber  int NOT NULL ,
	userGuid varchar(100) NOT NULL ,
	isRead  int NOT NULL ,
	gmtCreateTime  datetime NULL ,
	gmtModifiedTime  datetime NULL   
);
GO

-- 添加应用订阅表
create table if not exists platform_app_subscribe
(
	rowGuid  varchar(100) NOT NULL primary key ,
	appGuid  varchar(100) NOT NULL ,
	appUserGuid  varchar(100) NOT NULL ,
	orderNumber  int NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL   
);
GO

-- 添加应用反馈表
create table if not exists platform_app_feedback
(
	rowGuid  varchar(100) NOT NULL primary key ,
	appGuid  varchar(100) NOT NULL ,
	appUserGuid  varchar(100) NOT NULL ,
	feedback  varchar(200) NULL ,
	rateLevel  int NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL    
);
GO

-- 添加应用访问记录表
create table if not exists platform_app_access_log
(
	rowGuid  varchar(100) NOT NULL primary key ,
	appGuid  varchar(100) NOT NULL ,
	appUserGuid  varchar(100) NOT NULL ,
	clientOsType  int NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NULL     
);
GO

-- 添加搜索关键词表
create table if not exists platform_hotspot
(
	rowGuid  varchar(100) NOT NULL primary key ,
	searchContent  varchar(100) NULL ,
	areacode  varchar(50) NULL ,
	rate  int NULL    
);
GO

-- app_info添加字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'developverGuid') then
    alter table app_info add column developverGuid varchar(100);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'versionNumber') then
    alter table app_info add column versionNumber varchar(50);
end if;
	
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'pcIndexUrl') then
    alter table app_info add column pcIndexUrl varchar(100);
end if;
		
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'releaseDistrictCodeId') then
    alter table app_info add column releaseDistrictCodeId varchar(100);
end if;
			
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'allowDistrictCodeId') then
    alter table app_info add column allowDistrictCodeId varchar(100);
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'releaseTime') then
    alter table app_info add column releaseTime datetime;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'removeTime') then
    alter table app_info add column removeTime datetime;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'removeDesc') then
    alter table app_info add column removeDesc varchar(200);
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'subscribeNumber') then
    alter table app_info add column subscribeNumber int;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'rateLevel') then
    alter table app_info add column rateLevel int;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'submitTime') then
    alter table app_info add column submitTime datetime;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'auditTime') then
    alter table app_info add column auditTime datetime;
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'auditorGuid') then
    alter table app_info add column auditorGuid varchar(100);
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'auditDesc') then
    alter table app_info add column auditDesc varchar(500);
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'serviceType') then
    alter table app_info add column serviceType varchar(100);
end if;
				
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'servicePhoneNumber') then
    alter table app_info add column servicePhoneNumber varchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- messages_center和messages_center_histroy表添加appkey字段 --徐剑

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_center' and column_name = 'appkey') then
    alter table messages_center add column appkey nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_center_histroy' and column_name = 'appkey') then
    alter table messages_center_histroy add column appkey nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
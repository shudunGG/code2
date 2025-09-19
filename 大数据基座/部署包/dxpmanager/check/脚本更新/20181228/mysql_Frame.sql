-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- platform_hotspot表添加hotspottype字段 -- 俞俊男

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'platform_hotspot' and column_name = 'hotspottype') then
    alter table platform_hotspot add column hotspottype int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 开放平台客户端配置管理数据表添加 --俞俊男
-- 添加客户端配置表
create table if not exists platform_client_config
(
    configGuid  varchar(100) NOT NULL primary key,
    configName  varchar(100) NOT NULL ,
	configValue  varchar(500) NOT NULL ,
	configDesc  text NULL ,
	clientVersion  varchar(100) NOT NULL ,
	creatorGuid  varchar(100) NOT NULL ,
	updaterGuid  varchar(100) NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
);
GO

-- 添加客户端版本表
create table if not exists platform_client_version
(
    versionGuid  varchar(100) NOT NULL primary key,
	clientVersion  varchar(100) NOT NULL ,
	clientOsType  int NOT NULL ,
	versionDesc text NULL ,
	creatorGuid  varchar(100) NOT NULL ,
	updaterGuid  varchar(100) NOT NULL ,
	gmtCreateTime  datetime NOT NULL ,
	gmtModifiedTime  datetime NOT NULL 
);
GO

-- DELIMITER ; --
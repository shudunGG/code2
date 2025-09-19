-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- platform_hotspot表添加hotspottype字段 -- 俞俊男
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_hotspot') and column_name = upper('hotspottype');
  if (isexist = 0) then
    execute immediate 'alter table platform_hotspot add hotspottype integer';
  end if;
  end;
end;
/* GO */

-- 开放平台客户端配置管理数据表添加 -- 俞俊男
-- 添加客户端配置表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_client_config');
 if (isexist = 0) then
    execute immediate '
      create table platform_client_config
             (
				configGuid  nvarchar2(100) NOT NULL primary key,
				configName  nvarchar2(100) NOT NULL ,
				configValue  nvarchar2(500) NOT NULL ,
				configDesc  nclob NULL ,
				clientVersion  nvarchar2(100) NOT NULL ,
				creatorGuid  nvarchar2(100) NOT NULL ,
				updaterGuid  nvarchar2(100) NOT NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL 
              )';
  end if;
  end;
end;
/* GO */

-- 添加客户端版本表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_client_version');
 if (isexist = 0) then
    execute immediate '
      create table platform_client_version
             (
				versionGuid  nvarchar2(100) NOT NULL primary key,
				clientVersion  nvarchar2(100) NOT NULL ,
				clientOsType  number NOT NULL ,
				versionDesc nclob NULL ,
				creatorGuid  nvarchar2(100) NOT NULL ,
				updaterGuid  nvarchar2(100) NOT NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL 
              )';
  end if;
  end;
end;
/* GO */

-- end;



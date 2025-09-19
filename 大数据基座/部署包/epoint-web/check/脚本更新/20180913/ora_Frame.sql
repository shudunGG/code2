-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 开放平台数据表添加 -- 俞俊男

-- 添加平台用户表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_user');
 if (isexist = 0) then
    execute immediate '
      create table platform_user
             (
				userGuid  nvarchar2(100) NOT NULL primary key,
				loginId  nvarchar2(100) NOT NULL ,
				displayName  nvarchar2(100) NULL ,
				password  nvarchar2(100) NULL ,
				mobile  nvarchar2(100) NULL ,
				companyGuid  nvarchar2(100) NULL ,
				userType  number NOT NULL ,
				userStatus  number NOT NULL ,
				submitTime  date NOT NULL ,
				auditTime  date NULL ,
				auditorGuid  nvarchar2(100) NULL ,
				auditDesc  nvarchar2(500) NULL ,
				lastLoginTime  date NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL 
              )';
  end if;
  end;
end;
/* GO */

-- 添加APP用户表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_app_user');
 if (isexist = 0) then
    execute immediate '
      create table platform_app_user
             (
				userGuid  nvarchar2(100) NOT NULL primary key,
				loginId  nvarchar2(100) NULL ,
				displayName  nvarchar2(100) NULL ,
				realName nvarchar2(100) NULL ,
				password  nvarchar2(100) NOT NULL ,
				userImage blob NULL ,
				imageType nvarchar2(20) NULL ,
				userStatus  number NOT NULL ,
				mobile  nvarchar2(100) NOT NULL ,
				idCard  nvarchar2(100) NULL ,
				verifiedLevel  number NOT NULL ,
				email  nvarchar2(100) NULL ,
				address  nvarchar2(200) NULL ,
				postcode  nvarchar2(50) NULL ,
				areaCode  nvarchar2(100) NULL ,
				areaName  nvarchar2(100) NULL ,
				cityName  nvarchar2(100) NULL ,
				postAddress  nclob NULL ,
				alipayUserId  nvarchar2(100) NULL ,
				gmtCreateTime  date NULL ,
				gmtModifiedTime  date NULL
              )';
  end if;
  end;
end;
/* GO */

-- 添加企业表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_company');
 if (isexist = 0) then
    execute immediate '
      create table platform_company
             (
				companyGuid  nvarchar2(100) NOT NULL primary key,
				companyName  nvarchar2(100) NOT NULL ,
				industryCategory  nvarchar2(100) NOT NULL ,
				scale  nvarchar2(50) NULL ,
				companyStatus  number NOT NULL ,
				gmtCreateTime  date NULL ,
				gmtModifiedTime  date NULL
              )';
  end if;
  end;
end;
/* GO */

-- 添加信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_news');
 if (isexist = 0) then
    execute immediate '
      create table platform_news
             (
				newsGuid  nvarchar2(100) NOT NULL primary key,
				title  nvarchar2(100) NOT NULL ,
				newsContent  nclob NOT NULL ,
				outline  nvarchar2(100) NOT NULL ,
				orderNumber  number NOT NULL ,
				codeId  nvarchar2(100) NULL ,
				isReleased  number NOT NULL ,
				newsType  number NOT NULL ,
				url  nvarchar2(200) NULL ,
				areaCode  nvarchar2(100) NULL ,
				creatorGuid  nvarchar2(100) NOT NULL ,
				releaseTime  date NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL
              )';
  end if;
  end;
end;
/* GO */

-- 添加用户信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_user_news');
 if (isexist = 0) then
    execute immediate '
      create table platform_user_news
             (
				userNewsGuid  nvarchar2(100) NOT NULL primary key ,
				title  nvarchar2(100) NOT NULL ,
				outline  nvarchar2(100) NOT NULL ,
				newsContent  nvarchar2(500) NOT NULL ,
				orderNumber  number NOT NULL ,
				userGuid nvarchar2(100) NOT NULL ,
				isRead  number NOT NULL ,
				gmtCreateTime  date NULL ,
				gmtModifiedTime  date NULL
              )';
  end if;
  end;
end;
/* GO */

-- 添加应用订阅表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_app_subscribe');
 if (isexist = 0) then
    execute immediate '
      create table platform_app_subscribe
             (
				rowGuid  nvarchar2(100) NOT NULL primary key ,
				appGuid  nvarchar2(100) NOT NULL ,
				appUserGuid  nvarchar2(100) NOT NULL ,
				orderNumber  number NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL 
              )';
  end if;
  end;
end;
/* GO */

-- 添加应用反馈表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_app_feedback');
 if (isexist = 0) then
    execute immediate '
      create table platform_app_feedback
             (
				rowGuid  varchar(100) NOT NULL primary key ,
				appGuid  nvarchar2(100) NOT NULL ,
				appUserGuid  nvarchar2(100) NOT NULL ,
				feedback  nvarchar2(200) NULL ,
				rateLevel  number NOT NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NOT NULL 
              )';
  end if;
  end;
end;
/* GO */

-- 添加应用访问记录表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_app_access_log');
 if (isexist = 0) then
    execute immediate '
      create table platform_app_access_log
             (
				rowGuid  varchar(100) NOT NULL primary key ,
				appGuid  nvarchar2(100) NOT NULL ,
				appUserGuid  nvarchar2(100) NOT NULL ,
				clientOsType  number NULL ,
				gmtCreateTime  date NOT NULL ,
				gmtModifiedTime  date NULL 
              )';
  end if;
  end;
end;
/* GO */

-- 添加搜索关键词表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('platform_hotspot');
 if (isexist = 0) then
    execute immediate '
      create table platform_hotspot
             (
				rowGuid  varchar(100) NOT NULL primary key ,
				searchContent  nvarchar2(100) NULL ,
				areacode  nvarchar2(50) NULL ,
				rate  number NULL 
              )';
  end if;
  end;
end;
/* GO */


-- app_info添加字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('developverGuid');
  if (isexist = 0) then
    execute immediate 'alter table app_info add developverGuid  nvarchar2(100)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('versionNumber');
  if (isexist = 0) then
    execute immediate 'alter table app_info add versionNumber  nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('pcIndexUrl');
  if (isexist = 0) then
    execute immediate 'alter table app_info add pcIndexUrl  nvarchar2(100)';
  end if;
    
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('releaseDistrictCodeId');
  if (isexist = 0) then
    execute immediate 'alter table app_info add releaseDistrictCodeId  nvarchar2(100)';
  end if;
      
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('allowDistrictCodeId');
  if (isexist = 0) then
    execute immediate 'alter table app_info add allowDistrictCodeId  nvarchar2(100)';
  end if;
        
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('releaseTime');
  if (isexist = 0) then
    execute immediate 'alter table app_info add releaseTime  date';
  end if;
          
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('removeTime');
  if (isexist = 0) then
    execute immediate 'alter table app_info add removeTime  date';
  end if;
            
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('removeDesc');
  if (isexist = 0) then
    execute immediate 'alter table app_info add removeDesc  nvarchar2(200)';
  end if;
              
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('subscribeNumber');
  if (isexist = 0) then
    execute immediate 'alter table app_info add subscribeNumber  integer';
  end if;
                
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('rateLevel');
  if (isexist = 0) then
    execute immediate 'alter table app_info add rateLevel  integer';
  end if;
                  
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('submitTime');
  if (isexist = 0) then
    execute immediate 'alter table app_info add submitTime  date';
  end if;
                    
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('auditTime');
  if (isexist = 0) then
    execute immediate 'alter table app_info add auditTime  date';
  end if;
                      
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('auditorGuid');
  if (isexist = 0) then
    execute immediate 'alter table app_info add auditorGuid  nvarchar2(100)';
  end if;
                        
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('auditDesc');
  if (isexist = 0) then
    execute immediate 'alter table app_info add auditDesc  nvarchar2(500)';
  end if;
                          
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('serviceType');
  if (isexist = 0) then
    execute immediate 'alter table app_info add serviceType  nvarchar2(100)';
  end if;
                            
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('servicePhoneNumber');
  if (isexist = 0) then
    execute immediate 'alter table app_info add servicePhoneNumber  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- messages_center和messages_center_histroy表添加appkey字段 --徐剑
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center') and column_name = upper('appkey');
  if (isexist = 0) then
    execute immediate 'alter table messages_center add appkey nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center_histroy') and column_name = upper('appkey');
  if (isexist = 0) then
    execute immediate 'alter table messages_center_histroy add appkey nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



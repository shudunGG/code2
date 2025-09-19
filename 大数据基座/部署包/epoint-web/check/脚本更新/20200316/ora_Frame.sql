-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/15
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_sync_subscribe');
  if (isexist = 0) then
    execute immediate 'create table app_sync_subscribe
(
  rowguid             nvarchar2(50) not null primary key,
  clienttag           nvarchar2(50),
  clientname          nvarchar2(100),
  subscribepage       nvarchar2(200),
  createdate          date
 )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_soanotify_log');
  if (isexist = 0) then
    execute immediate 'create table frame_soanotify_log
(
  logguid                 nvarchar2(50) not null primary key,
  status                  integer,
  eventname               nvarchar2(50),
  entityname              nvarchar2(100),
  datalist                clob,
  clienttype              nvarchar2(50),
  pushguid                nvarchar2(50),
  remark                  nvarchar2(2000),
  appkey                  nvarchar2(50),
  notifylistener          nvarchar2(100),
  pushdate                date,
  pushurl                 nvarchar2(200)
 )';
  end if;
  end;
end;
/* GO */

-- 2020/03/16
-- 添加frame_privacy隐私表   --孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_privacy');
  if (isexist = 0) then
    execute immediate 'create table frame_privacy
(
  RowGuid               nvarchar2(50) not null primary key,
  privacyStatement     	nvarchar2(2000),
  privacyVersion        nvarchar2(50),
  privacyStatus         integer default 0,
  publishTime           date
 )';
  end if;
  end;
end;
/* GO */

-- 2020/03/16
-- 添加frame_privacy_agree隐私同意表   --孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_privacy_agree');
  if (isexist = 0) then
    execute immediate 'create table frame_privacy_agree
(
  RowGuid              	nvarchar2(50) not null primary key,
  privacyGuid        	nvarchar2(50),
  agreeUserguid         nvarchar2(50),
  agreeTime             date
 )';
  end if;
  end;
end;
/* GO */

-- end;



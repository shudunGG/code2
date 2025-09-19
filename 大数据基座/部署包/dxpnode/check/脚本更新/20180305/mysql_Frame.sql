-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/03/05

-- 快照表frame_ou_snapshot --周志豪
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou_snapshot') then
create table frame_ou_snapshot (
  ouguid varchar(100) not null,
  oucode varchar(100) default null,
  ouname varchar(100) default null,
  oushortname varchar(100) default null,
  ordernumber int(11) default '0',
  description varchar(100) default null,
  address varchar(100) default null,
  postalcode varchar(100) default null,
  tel varchar(100) default null,
  baseouguid varchar(100) default null,
  issubwebflow int(11) default '0',
  parentouguid varchar(100) default null,
  oucodelevel varchar(500) default null,
  haschildou int(11) default '0',
  haschilduser int(11) default '0',
  updatetime datetime default null,
  ordernumberfull varchar(1000) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_ou_snapshot (ouguid,appkey,clientip)
);
ELSE
drop table if exists frame_ou_snapshot;
create table frame_ou_snapshot (
  ouguid varchar(100) not null,
  oucode varchar(100) default null,
  ouname varchar(100) default null,
  oushortname varchar(100) default null,
  ordernumber int(11) default '0',
  description varchar(100) default null,
  address varchar(100) default null,
  postalcode varchar(100) default null,
  tel varchar(100) default null,
  baseouguid varchar(100) default null,
  issubwebflow int(11) default '0',
  parentouguid varchar(100) default null,
  oucodelevel varchar(500) default null,
  haschildou int(11) default '0',
  haschilduser int(11) default '0',
  updatetime datetime default null,
  ordernumberfull varchar(1000) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_ou_snapshot (ouguid,appkey,clientip)
);

end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 快照表frame_ou_e_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_userrole_snapshot') then
create table frame_ou_e_snapshot (
  ouguid varchar(100) not null,
  isindependence int(11) default null,
  oufax varchar(200) default null,
  oucertguid varchar(100) default null,
  oucertcontent longblob,
  oucertname varchar(200) default null,
  individuationimgpath varchar(300) ,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  unique key uq_frame_ou_e_snapshot (ouguid,appkey,clientip)
);
ELSE
drop table if exists frame_ou_e_snapshot;
create table frame_ou_e_snapshot (
  ouguid varchar(100) not null,
  isindependence int(11) default null,
  oufax varchar(200) default null,
  oucertguid varchar(100) default null,
  oucertcontent longblob,
  oucertname varchar(200) default null,
  individuationimgpath varchar(300) ,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  unique key uq_frame_ou_e_snapshot (ouguid,appkey,clientip)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO




-- 快照表frame_userrole_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_userrole_snapshot') then
create table frame_userrole_snapshot (
  row_id int(11) not null,
  userguid varchar(50) default null,
  roleguid varchar(50) default null,
  updatetime datetime default null,
  isfromsoa int(38) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null primary key,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  userroleguid varchar(50) default null,
  unique key uq_frame_userrole_snapshot (userguid,roleguid,appkey,clientip)
);
ELSE
drop table if exists frame_userrole_snapshot;
create table frame_userrole_snapshot (
  row_id int(11) not null,
  userguid varchar(50) default null,
  roleguid varchar(50) default null,
  updatetime datetime default null,
  isfromsoa int(38) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null primary key,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  userroleguid varchar(50) default null,
  unique key uq_frame_userrole_snapshot (userguid,roleguid,appkey,clientip)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 快照表frame_user_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_snapshot') then
create table frame_user_snapshot (
  userguid varchar(100) not null,
  loginid varchar(100) not null,
  password varchar(200) default null,
  ouguid varchar(100) default null,
  displayname varchar(100) not null,
  isenabled int(11) default '0',
  title varchar(200) default null,
  leaderguid varchar(100) default null,
  ordernumber int(11) default '0',
  telephoneoffice varchar(100) default null,
  mobile varchar(100) default null,
  email varchar(200) default null,
  description varchar(200) default null,
  telephonehome varchar(100) default null,
  fax varchar(100) default null,
  allowuseemail int(11) default '0',
  sex varchar(100) default null,
  oucodelevel varchar(500) default null,
  updatetime datetime default null,
  row_id int(11) default null,
  firstname varchar(100) default null,
  middlename varchar(100) default null,
  lastname varchar(100) default null,
  prelang varchar(100) default null,
  timezone varchar(100) default null,
  adloginid varchar(200) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null primary key,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  updatepwd datetime default null,
  unique key uq_frame_user_snapshot (userguid,appkey,clientip),
  key rowguid (rowguid),
  key userguid (userguid),
  key loginid (loginid)
);
ELSE
drop table if exists frame_user_snapshot;
create table frame_user_snapshot (
  userguid varchar(100) not null,
  loginid varchar(100) not null,
  password varchar(200) default null,
  ouguid varchar(100) default null,
  displayname varchar(100) not null,
  isenabled int(11) default '0',
  title varchar(200) default null,
  leaderguid varchar(100) default null,
  ordernumber int(11) default '0',
  telephoneoffice varchar(100) default null,
  mobile varchar(100) default null,
  email varchar(200) default null,
  description varchar(200) default null,
  telephonehome varchar(100) default null,
  fax varchar(100) default null,
  allowuseemail int(11) default '0',
  sex varchar(100) default null,
  oucodelevel varchar(500) default null,
  updatetime datetime default null,
  row_id int(11) default null,
  firstname varchar(100) default null,
  middlename varchar(100) default null,
  lastname varchar(100) default null,
  prelang varchar(100) default null,
  timezone varchar(100) default null,
  adloginid varchar(200) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null primary key,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  updatepwd datetime default null,
  unique key uq_frame_user_snapshot (userguid,appkey,clientip),
  key rowguid (rowguid),
  key userguid (userguid),
  key loginid (loginid)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 快照表frame_user_e_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_e_snapshot') then
create table frame_user_e_snapshot (
  row_id int(11) default '0',
  userguid varchar(100) not null,
  usbkey varchar(100) default null,
  birthday datetime default null,
  qqnumber varchar(100) default null,
  msnnumber varchar(100) default null,
  piccontent longblob,
  piccontenttype varchar(200) default null,
  postaladdress varchar(200) default null,
  postalcode varchar(100) default null,
  identitycardnum varchar(100) default null,
  isdisable int(11) default '0',
  ntx_extnumber varchar(100) default null,
  ntx_password varchar(100) default null,
  epassrnd varchar(100) default null,
  epassserial varchar(100) default null,
  epassguid varchar(100) default null,
  epasspwd varchar(100) default null,
  ad_account varchar(100) default null,
  loginip varchar(200),
  shortmobile varchar(100) default null,
  appkey varchar(100) default null,
  rowguid varchar(100) not null,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  carnum varchar(50) default null,
  unique key uq_frame_user_e_snapshot (userguid,appkey,clientip),
  key rowguid (rowguid),
  key userguid (userguid)
);
ELSE
drop table if exists frame_user_e_snapshot;
create table frame_user_e_snapshot (
  row_id int(11) default '0',
  userguid varchar(100) not null,
  usbkey varchar(100) default null,
  birthday datetime default null,
  qqnumber varchar(100) default null,
  msnnumber varchar(100) default null,
  piccontent longblob,
  piccontenttype varchar(200) default null,
  postaladdress varchar(200) default null,
  postalcode varchar(100) default null,
  identitycardnum varchar(100) default null,
  isdisable int(11) default '0',
  ntx_extnumber varchar(100) default null,
  ntx_password varchar(100) default null,
  epassrnd varchar(100) default null,
  epassserial varchar(100) default null,
  epassguid varchar(100) default null,
  epasspwd varchar(100) default null,
  ad_account varchar(100) default null,
  loginip varchar(200),
  shortmobile varchar(100) default null,
  appkey varchar(100) default null,
  rowguid varchar(100) not null,
  clientip varchar(50) default null,
  tenantguid varchar(50) default null,
  carnum varchar(50) default null,
  unique key uq_frame_user_e_snapshot (userguid,appkey,clientip),
  key rowguid (rowguid),
  key userguid (userguid)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 快照表frame_secondou_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_secondou_snapshot') then
create table frame_secondou_snapshot (
  row_id int(38) not null,
  userguid varchar(50) not null,
  ouguid varchar(50) not null,
  title varchar(200) default null,
  tel varchar(200) default null,
  ordernumber int(20) default '0',
  userordernumber int(38) default '0',
  appkey varchar(50) default null,
  clientip varchar(50) default null,
  rowguid varchar(50) not null,
  unique key uq_frame_secondou_snapshot (userguid,ouguid,appkey,clientip)
);
ELSE
drop table if exists frame_secondou_snapshot;
create table frame_secondou_snapshot (
  row_id int(38) not null,
  userguid varchar(50) not null,
  ouguid varchar(50) not null,
  title varchar(200) default null,
  tel varchar(200) default null,
  ordernumber int(20) default '0',
  userordernumber int(38) default '0',
  appkey varchar(50) default null,
  clientip varchar(50) default null,
  rowguid varchar(50) not null,
  unique key uq_frame_secondou_snapshot (userguid,ouguid,appkey,clientip)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 快照表frame_roletype_snapshot
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_roletype_snapshot') then
create table frame_roletype_snapshot (
  roletypeguid varchar(100) not null,
  roletypename varchar(100) default null,
  ordernumber int(11) default null,
  belongbaseouguid varchar(100) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_roletype_snapshot (roletypeguid,appkey,clientip)
);
ELSE
drop table if exists frame_roletype_snapshot;
create table frame_roletype_snapshot (
  roletypeguid varchar(100) not null,
  roletypename varchar(100) default null,
  ordernumber int(11) default null,
  belongbaseouguid varchar(100) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_roletype_snapshot (roletypeguid,appkey,clientip)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 快照表frame_role_snapshot 
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_role_snapshot') then
drop table if exists frame_role_snapshot;
create table frame_role_snapshot (
  roleguid varchar(100) not null,
  rolename varchar(100) default null,
  ordernumber int(11) default '0',
  isreserved int(11) default '0',
  belongouguid varchar(100) default null,
  roletype varchar(100) default null,
  row_id int(20) default null,
  isallowassign int(11) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_role_snapshot (roleguid,appkey,clientip)
);
ELSE
drop table frame_role_snapshot;
create table frame_role_snapshot (
  roleguid varchar(100) not null,
  rolename varchar(100) default null,
  ordernumber int(11) default '0',
  isreserved int(11) default '0',
  belongouguid varchar(100) default null,
  roletype varchar(100) default null,
  row_id int(20) default null,
  isallowassign int(11) default null,
  appkey varchar(50) default null,
  rowguid varchar(50) not null,
  clientip varchar(50) default null,
  unique key uq_frame_role_snapshot (roleguid,appkey,clientip)
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
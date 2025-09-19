-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/03/05

-- 快照表frame_roletype_snapshot --周志豪
if exists (select * from dbo.sysobjects where id = object_id('frame_roletype_snapshot'))
drop table frame_roletype_snapshot;
GO
create table frame_roletype_snapshot
( 
   roletypeguid     nvarchar(50) not null,
   roletypename     nvarchar(50) null,
   ordernumber      int null,
   belongbaseouguid nvarchar(50) null,
   appkey           nvarchar(50) null,
   rowguid          nvarchar(50) not null primary key,
   clientip         nvarchar(50) null
);
alter table frame_roletype_snapshot add unique (roletypeguid, appkey, clientip)
GO


-- 快照表frame_secondou_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_secondou_snapshot'))
drop table frame_secondou_snapshot;
GO
create table frame_secondou_snapshot
( 
    row_id      int not null,
    userguid    nvarchar(50) not null,
    ouguid      nvarchar(50) not null,
    title       nvarchar(100) null,
    tel         nvarchar(100) null,
    ordernumber float null,
    user_ordernumber float null,
    appkey           nvarchar(50) null,
    clientip         nvarchar(50) null,
    orderfloat       float null,
    user_orderfloat  float null,
    rowguid          nvarchar(50) not null primary key
);
alter table frame_secondou_snapshot add unique (userguid, ouguid, appkey, clientip)
GO


-- 快照表frame_user_e_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_user_e_snapshot'))
drop table frame_user_e_snapshot;
GO
create table frame_user_e_snapshot
( 
   row_id int null,
   userguid nvarchar(50) not null,
   usbkey nvarchar(50) null,
   birthday datetime null,
   qqnumber nvarchar(50) null,
   msnnumber nvarchar(50) null,
   piccontent image null,
   piccontenttype nvarchar(100) null,
   postaladdress nvarchar(100) null,
   postalcode nvarchar(50) null,
   identitycardnum nvarchar(50) null,
   isdisable int null,
   ntx_extnumber nvarchar(50) null,
   ntx_password nvarchar(50) null,
   epassrnd nvarchar(50) null,
   epassserial nvarchar(50) null,
   epassguid nvarchar(50) null,
   epasspwd nvarchar(50) null,
   ad_account nvarchar(50) null,
   loginip nvarchar(200) null,
   shortmobile nvarchar(50) null,
   appkey nvarchar(50) null,
   rowguid nvarchar(50) not null primary key,
   clientip nvarchar(50) null,
   tenantguid nvarchar(50) null,
   carnum nvarchar(50) null
);
alter table frame_user_e_snapshot add unique (userguid, appkey, clientip)
GO

-- 快照表frame_user_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_user_snapshot'))
drop table frame_user_snapshot;
GO
create table frame_user_snapshot
( 
  userguid    nvarchar(50) not null,
  loginid     nvarchar(50) not null,
  password    nvarchar(50) null,
  ouguid      nvarchar(50) null,
  displayname nvarchar(50) not null,
  isenabled   int null,
  title       nvarchar(100) null,
  leaderguid  nvarchar(50) null,
  ordernumber int null,
  telephoneoffice nvarchar(50) null,
  mobile       nvarchar(50) null,
  email        nvarchar(100) null,
  description  nvarchar(100) null,
  telephonehome  nvarchar(50) null,
  fax          nvarchar(50) null,
  allowuseemail int null,
  sex          nvarchar(50) null,
  oucodelevel  nvarchar(500) null,
  updatetime datetime null,
  row_id int null,
  firstname nvarchar(100) null,
  middlename nvarchar(100) null,
  lastname nvarchar(100) null,
  prelang nvarchar(100) null,
  timezone nvarchar(50) null,
  adloginid nvarchar(50) null,
  appkey nvarchar(50) null,
  rowguid nvarchar(50) not null primary key,
  clientip nvarchar(50) null,
  tenantguid nvarchar(50) null,
  updatepwd datetime null
);
alter table frame_user_snapshot add unique (userguid, appkey, clientip)
GO

-- 快照表frame_userrole_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_userrole_snapshot'))
drop table frame_userrole_snapshot;
GO
create table frame_userrole_snapshot
( 
   row_id int not null,
   userguid nvarchar(50) null,
   roleguid nvarchar(50) null,
   updatetime datetime null,
   isfromsoa int null,
   appkey nvarchar(50) null,
   rowguid nvarchar(50) not null primary key,
   clientip nvarchar(50) null,
   tenantguid nvarchar(50) null
);
alter table frame_userrole_snapshot add unique (userguid, roleguid, appkey, clientip)
GO

-- 快照表frame_ou_e_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_ou_e_snapshot'))
drop table frame_ou_e_snapshot;
GO
create table frame_ou_e_snapshot
( 
   ouguid         nvarchar(50) not null,
   isindependence int null,
   oufax          nvarchar(100) null,
   oucertguid     nvarchar(50) null,
   oucertcontent  image null,
   oucertname     nvarchar(100) null,
   individuationimgpath nvarchar(300) null,
   appkey         nvarchar(50) null,
   rowguid nvarchar(50) not null primary key,
   clientip nvarchar(50) null,
   tenantguid nvarchar(50) null
);
alter table frame_ou_e_snapshot add unique (ouguid, appkey, clientip)
GO

-- 快照表frame_ou_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_ou_snapshot'))
drop table frame_ou_snapshot;
GO
create table frame_ou_snapshot
( 
    ouguid      nvarchar(50) not null,
    oucode      nvarchar(50) null,
    ouname      nvarchar(50) null,
    oushortname nvarchar(50) null,
    ordernumber int null,
    description nvarchar(50) null,
    address     nvarchar(50) null,
    postalcode  nvarchar(50) null,
    tel         nvarchar(50) null,
    baseouguid  nvarchar(50) null,
    issubwebflow int null,
    parentouguid nvarchar(50) null,
    oucodelevel nvarchar(500) null,
    haschildou int null,
    haschilduser int null,
    updatetime datetime null,
    testvarchar nvarchar(50) null,
    testintger int null,
    testnumber int null,
    ordernumberfull nvarchar(1000) null,
    appkey nvarchar(50) null,
    rowguid nvarchar(50) not null primary key,
    clientip nvarchar(50) null,
    tenantguid nvarchar(50) null,
    bussinessoucode nvarchar(127) null,
    row_id int null
);
alter table frame_ou_snapshot add unique (ouguid, appkey, clientip)
GO

-- 快照表frame_role_snapshot
if exists (select * from dbo.sysobjects where id = object_id('frame_role_snapshot'))
drop table frame_role_snapshot;
GO
create table frame_role_snapshot
( 
   roleguid nvarchar(50) not null,
   rolename nvarchar(50) null,
   ordernumber int null,
   isreserved int null,
   belongouguid nvarchar(50) null,
   roletype nvarchar(50) null,
   row_id int null,
   isallowassign int null,
   appkey nvarchar(50) null,
   rowguid nvarchar(50) not null primary key,
   clientip nvarchar(50) null
);
alter table frame_role_snapshot add unique (roleguid, appkey, clientip)
GO



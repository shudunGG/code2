-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2017/5/27
-- frame_workingday增加一个字段 --施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_workingday' and column_name = 'lunar') then
    alter table frame_workingday add column lunar  varchar(50); 
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
            where table_schema = database() and table_name = 'frame_workingday' and column_name = 'isfestival') then
    alter table frame_workingday add column isfestival  varchar(50); 
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/5/27
-- 工作日相关 --何晓瑜
-- 节假日信息表
create table  if not exists  frame_festival 
(
  rowguid           varchar(50)  primary key,
  festivalname      varchar(50),
  starttime         datetime,
  endtime           datetime,
  takeoffday        varchar(50),
  currentyear       integer
);
GO

-- 2017/6/7
-- 新增可扩展控件属性表 --季立霞
create table if not exists epointsform_control_property
(
  propertyguid   varchar(50) not null primary key,
  controlguid   varchar(50),
  propertyname   varchar(100),
  propertyenglishname  varchar(50),
  allowfieldtype   varchar(500),
  displaytype   varchar(50),
  datasourcename  varchar(500),
  initiatemode   varchar(10),
  ordernum    integer
  );
GO

-- 新增可扩展控件表    --季立霞
  create table if not exists  epointsform_extensible_control
  (
  controlguid varchar(50)  not null primary key,
  controlname varchar(100),
  controlenglishname  varchar(50),
  allowfieldtype  varchar(500),
  smallicon  varchar(2000),
  largeicon  varchar(2000),
  template    varchar(500),
  initiatemode  varchar(10),
   ordernum  integer,
  defaultvalue varchar(500)
  );
GO

-- frame_workingday和frame_festival各增加一个字段 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_workingday' and column_name = 'isfestival') then
    alter table frame_workingday add column isfestival  int;
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
            where table_schema = database() and table_name = 'frame_festival' and column_name = 'festivaltime') then
    alter table frame_festival add column festivaltime  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 2017/6/13
-- 元件表新增字段--樊志君
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'portal_item' and column_name = 'rowspan') then
    alter table portal_item add column  rowspan  int;
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
            where table_schema = database() and table_name = 'portal_item' and column_name = 'colspan') then
    alter table portal_item add column colspan  int;
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
            where table_schema = database() and table_name = 'portal_item' and column_name = 'url') then
    alter table portal_item add column url  varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 个人元件表新增字段--樊志君
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'portal_myitem' and column_name = 'rowspan') then
    alter table portal_myitem add column rowspan  int;
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
            where table_schema = database() and table_name = 'portal_myitem' and column_name = 'colspan') then
    alter table portal_myitem add column colspan  int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/6/19
--  王颜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'portal_item' and column_name = 'belongportalguid') then
    alter table portal_item add column belongportalguid  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 首页元件视图修改--樊志君
create or replace view view_portal_myitem as
select  portal_myitem.rowguid as myrowguid, 
        portal_myitem.userguid, 
	      portal_item.initrow, 
	      portal_item.initcol,
	      portal_item.rowspan, 
	      portal_item.colspan,
	      portal_item.belongportalguid,
        portal_item.title,
	      portal_item.datarows, 
	      portal_item.rowguid,
        portal_myitem.itemcol, 
	      portal_myitem.itemrow,
	      portal_myitem.rowspan as itemrowspan, 
	      portal_myitem.colspan as itemcolspan, 
	      portal_myitem.disabled,
        portal_item.url
from    portal_item inner join 
        portal_myitem on portal_item.rowguid = portal_myitem.portaletguid
where     (portal_item.disabled = 0);
GO

-- 2017/6/30
-- 用户表（frame_user）添加updatepwd（修改密码时间）字段，并初始化数据--王露
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user' and column_name = 'updatepwd') then
    alter table frame_user add column   updatepwd datetime;
    update frame_user set updatepwd =sysdate();
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 2017/07/06
-- 新增物理表api_class(服务类别) 施佳炜
create table if not exists api_class
(
   belongxiaqucode varchar(50) null,
   operateusername varchar(50) null,
   operatedate datetime null,
   row_id int(11) null,
   yearflag varchar(4) null,
   rowguid varchar(50) not null primary key,
   apiclassguid varchar(50) null,
   apiclassname varchar(100) not null,
   apiclassremark varchar(1000) null,
   ordernumber int(11) null,
   apiclassparentguid varchar(100) null
);
GO

--  新增物理表api_scope(方法别名) 施佳炜
create table if not exists api_scope

( 
   belongxiaqucode varchar(50) null,
   operateusername varchar(50) null,
   operatedate datetime null,
   row_id int(11) null,
   yearflag varchar(4) null,
   rowguid varchar(50) not null primary key,
   scopeguid varchar(50) null,
   scopename varchar(50) null,
   description varchar(200) null,
   ordernum int(11) null,
   scopekey varchar(50) null
);
GO

--  新增物理表api_info(服务基本信息) 施佳炜
create table if not exists api_info 
(
  belongxiaqucode varchar(50) null,
  operateusername varchar(50) null,
  operatedate datetime null,
  row_id int(11) null,
  yearflag varchar(4) null,
  rowguid varchar(50) not null primary key,
  apiguid varchar(50) null,
  apiname varchar(200) null,
  categoryid varchar(100) null,
  status varchar(50) null,
  description varchar(200) null,
  apirealurl varchar(100) null, 
  urlpattern varchar(500) null,
  userauth varchar(50) null, 
  clientauth varchar(50) null
);
GO

--  新增物理表API_SCOPE_RELATION(方法scope关联表实体) 施佳炜
create table if not exists api_scope_relation
(
  belongxiaqucode varchar(50) null,
  operateusername varchar(50) null,
  operatedate datetime null,
  row_id int(11) null,
  yearflag varchar(2) null,
  rowguid varchar(50) not null primary key,
  apiguid varchar(50) null,
  scopeguid varchar(50) null
);
GO

--  添加数据表api_log(api日志表)
create table if not exists  api_runtime_log
(
   belongxiaqucode varchar(50) null,
   operateusername varchar(50) null,
   operatedate datetime null,
   row_id int(11) null,
   yearflag varchar(4) null,
   rowguid varchar(50)  not null primary key,
   startat datetime null,
   method varchar(50) null,
   requestsize float(18,2) null,
   consumer varchar(50) null,
   clientip varchar(50) null,
   responsesize float(18,2) null,
   status int(11) null,
   forwardtime int(11) null,
   requesttime int(11) null,
   requesturl varchar(500) null,
   context longtext null,
   apiid varchar(50) null,
   apiname varchar(50) null
);
GO

-- 创建数据表API_SYNC_LOG
create table if not exists api_sync_log
(
   belongxiaqucode varchar(50) null,
   operateusername varchar(50) null,
   operatedate datetime null,
   row_id int(11) null,
   yearflag varchar(2) null,
   rowguid varchar(50) not null primary key,
   type varchar(50) null,
   recorddate datetime null,
   status longtext null,
   description varchar(1000) null,
   clientid varchar(50) null
);
GO

-- 2017/07/12
-- 新增物理表FRAME_OU_E_SNAPSHOT(Frame_OU_E_SnapShot) --施佳炜
create table if not exists  frame_ou_e_snapshot 
(
   ouguid         varchar(50) not null,
   isindependence int(11) null,
   oufax          varchar(50) null,
   oucertguid     varchar(50) null,
   oucertcontent  blob null,
   oucertname     varchar(50) null,
   individuationimgpath longtext null,
   appkey         varchar(50) null,
   rowguid varchar(50) not null,
   clientip varchar(50) null,
   tenantguid varchar(50) null
);
GO

-- 创建数据表FRAME_OU_SNAPSHOT --施佳炜
create table if not exists frame_ou_snapshot
(
    ouguid      varchar(50) not null,
    oucode      varchar(50) null,
    ouname      varchar(50) null,
    oushortname varchar(50) null,
    ordernumber int(11) null,
    description varchar(50) null,
    address     varchar(50) null,
    postalcode  varchar(50) null,
    tel         varchar(50) null,
    baseouguid  varchar(50) null,
    issubwebflow int(11) null,
    parentouguid varchar(50) null,
    oucodelevel varchar(500) null,
    haschildou int(11) null,
    haschilduser int(11) null,
    updatetime datetime null,
    testvarchar varchar(50) null,
    testintger int(11) null,
    testnumber int(11) null,
    ordernumberfull varchar(500) null,
    appkey varchar(50) null,
    rowguid varchar(50) not null,
    clientip varchar(50) null,
    tenantguid varchar(50) null,
    bussinessoucode varchar(127) null,
    row_id int(11) null
);
GO

-- 新增物理表FRAME_ROLE_SNAPSHOT(Frame_Role_SnapShot) --施佳炜
create table if not exists frame_role_snapshot
(
   roleguid varchar(50) not null,
   rolename varchar(50) null,
   ordernumber int(11) null,
   isreserved int(11) null,
   belongouguid varchar(50) null,
   roletype varchar(50) null,
   row_id int(11) null,
   isallowassign int(11) null,
   appkey varchar(50) null,
   rowguid varchar(50) not null,
   clientip varchar(50) null
);
GO

-- 添加数据表FRAME_ROLETYPE_SNAPSHOT(Frame_RoleType_SnapShot)--施佳炜
create table if not exists frame_roletype_snapshot
(
   roletypeguid     varchar(50) not null,
   roletypename     varchar(50) null,
   ordernumber      int(11) null,
   belongbaseouguid varchar(50) null,
   appkey           varchar(50) null,
   rowguid          varchar(50) not null,
   clientip         varchar(50) null
);
GO

-- 新增物理表FRAME_SECONDOU_SNAPSHOT(Frame_SecondOU_SnapShot)--施佳炜
create table if not exists frame_secondou_snapshot
(
    row_id      int(11) not null,
    userguid    varchar(50) not null,
    ouguid      varchar(50) not null,
    title       varchar(100) null,
    tel         varchar(100) null,
    ordernumber float(20) null,
    user_ordernumber float(38) null,
    appkey           varchar(50) null,
    clientip         varchar(50) null,
    orderfloat       float(38) null,
    user_orderfloat  float(38) null,
    rowguid          varchar(50) not null
);
GO

-- 新增物理表Frame_User_E_SnapShot(Frame_User_E_SnapShot)--施佳炜
create table if not exists frame_user_e_snapshot
(
   row_id int(11) null,
   userguid varchar(50) not null,
   usbkey varchar(50) null,
   birthday datetime null,
   qqnumber varchar(50) null,
   msnnumber varchar(50) null,
   piccontent blob null,
   piccontenttype varchar(50) null,
   postaladdress varchar(50) null,
   postalcode varchar(50) null,
   identitycardnum varchar(50) null,
   isdisable int(11) null,
   ntx_extnumber varchar(50) null,
   ntx_password varchar(50) null,
   epassrnd varchar(50) null,
   epassserial varchar(50) null,
   epassguid varchar(50) null,
   epasspwd varchar(50) null,
   ad_account varchar(50) null,
   loginip longtext null,
   shortmobile varchar(50) null,
   appkey varchar(50) null,
   rowguid varchar(50) not null primary key,
   clientip varchar(50) null,
   tenantguid varchar(50) null,
   carnum varchar(50) null
);
GO

-- 新增物理表FRAME_USERROLE_SNAPSHOT(Frame_UserRole_SnapShot) --施佳炜
create table if not exists frame_userrole_snapshot
(
   row_id int(11) not null,
   userguid varchar(50) null,
   roleguid varchar(50) null,
   updatetime datetime null,
   isfromsoa int(11) null,
   appkey varchar(50) null,
   rowguid varchar(50) not null primary key,
   clientip varchar(50) null,
   tenantguid varchar(50) null
);
GO

-- 新增物理表FRAME_USER_SNAPSHOT(Frame_User_SnapShot) --施佳炜
create table if not exists frame_user_snapshot
(
  userguid    varchar(50) not null,
  loginid     varchar(50) not null,
  password    varchar(50) null,
  ouguid      varchar(50) null,
  displayname varchar(50) not null,
  isenabled   int(11) null,
  title       varchar(50) null,
  leaderguid  varchar(50) null,
  ordernumber int(11) null,
  telephoneoffice varchar(50) null,
  mobile       varchar(50) null,
  email        varchar(50) null,
  description  varchar(50) null,
  telephonehome  varchar(50) null,
  fax          varchar(50) null,
  allowuseemail int(11) null,
  sex          varchar(50) null,
  oucodelevel  varchar(500) null,
  updatetime datetime null,
  row_id int(11) null,
  firstname varchar(50) null,
  middlename varchar(50) null,
  lastname varchar(50) null,
  prelang varchar(50) null,
  timezone varchar(50) null,
  adloginid varchar(50) null,
  appkey varchar(50) null,
  rowguid varchar(50) not null,
  clientip varchar(50) null,
  tenantguid varchar(50) null,
  updatepwd datetime null
);
GO

-- 2017/07/12
-- 新增应用类别表--何晓瑜
create table if not exists app_class
(  
  appclassguid         varchar(50) not null primary key,
  appclassname         varchar(50),
  appclassremark       varchar(200),
  ordernumber          varchar(50),
  appclassparentguid   varchar(50),
  appplat              varchar(50)
);
GO

-- 新增应用表--何晓瑜
create table if not exists app_info
(
  rowguid               varchar(50) not null primary key,
  appkey                varchar(50),
  appsecret             varchar(50),
  appname               varchar(100),
  callbackurl           varchar(1000),
  approoturl            varchar(1000),
  appconfigurl          varchar(1000),
  apptype               varchar(50),
  appstatus             varchar(50),
  createdate            datetime,
  binddomain            varchar(50),
  appentryname          varchar(50),
  apprealurl            varchar(1000),
  appclass              varchar(50),
  appicon_b             varchar(50),
  appicon_s             varchar(50),
  metrocolspan          float(18,2),
  metrorowspan          float(18,2),
  metrobgcolor          varchar(50),
  metroinnerurl         varchar(500),
  metroisblank          varchar(1),
  iosisblank            varchar(1),
  metropageindex        int(2),
  metrohowindex         float(18,2),
  scope                 varchar(100),
  granttypes             varchar(100),
  accesstokenvalidity   int(11),
  refreshtokenvalidity  int(11),
  archived              float(18,2),
  trusted               float(18,2),
  iosappwindowwidth     float(18,2),
  iosappwindowheight    float(18,2),
  metroappwindowwidth   float(18,2),
  metroappwindowheight  float(18,2),
  iospageindex          int(2),
  iosshowindex          float(18,2),
  appdesc               varchar(255),
  ssoindex              varchar(50),
  ordernum              int(11)
);
GO

-- 新增服务订阅表--何晓瑜
create table if not exists api_subscribe 
(
  rowguid             varchar(50) not null primary key,
  apiguid             varchar(50),
  appguid             varchar(50),
  isenable            int(11),
  refuse              varchar(50)
);
GO

-- 新增服务订阅视图 --何晓瑜
create or replace view view_subscribed_api as
select b.apiguid,
       b.categoryid,
       b.status,
       -- b.remark,
       -- b.tag,
       b.description,
       b.apiname,
       -- b.apiprovider,
       -- b.apiversion,
       -- b.context,
       a.isenable,
       a.refuse,
       a.appguid,
       a.rowguid
  from api_subscribe a
  join api_info b
    on a.apiguid = b.rowguid;
GO

-- 新增元件表 --何晓瑜
create table if not exists app_element  
(
  rowguid                 varchar(50) not null primary key,
  appguid                 varchar(50),
  elementname             varchar(50),
  elementurl              varchar(50),
  elementdesc             varchar(200),
  identityname            varchar(50),
  ordernum                int(11),
  positiontop             int(11),
  positionleft            int(11),
  width                   int(11),
  height                  int(11),
  linkapp                 varchar(50),
  allowclosebutton        int(11),
  appstatus               int(11),
  isinit                  int(11),
  userconfigurl             varchar(50),
  thumbnail                 varchar(50),
  picturebig                varchar(50),
  desktopcreateappstoreicon varchar(50),
  pageindex                 int(11)
);
GO

-- 新增元件授权表 --何晓瑜
create table if not exists app_element_right 
(
  rowguid             varchar(50) not null primary key,
  allowtype           varchar(50),
  allowto             varchar(50),
  elementguid         varchar(50)
);
GO


-- 新增子应用表 --何晓瑜
create table if not exists app_module
(
  moduleguid           varchar(50)  not null primary key,
  appguid              varchar(50),
  modulecode           varchar(50),
  modulename           varchar(50),
  modulemenuname       varchar(50),
  ordernumber          int(10),
  isdisable            int(10),
  isblank              int(10),
  bigiconaddress       varchar(100),
  smalliconaddress     varchar(100),
  appkey               varchar(50),
  showinportal         int(10),
  moduleurl            varchar(500),
  needsync             int(10),
  metrocolspan         int(10),
  metrorowspan         int(10),
  metrobgcolor         varchar(50),
  metroinnerurl        varchar(500),
  metroappwindowwidth  float(10,2),
  metroappwindowheight float(10,2),
  metroisblank         varchar(1),
  iosisblank           varchar(1),
  metropageindex       int(8),
  metroshowindex       int(8),
  iosappwindowwidth    float(10,2),
  iosappwindowheight   float(10,2),
  iospageindex         int(8),
  iosshowindex         int(8)
);
GO

-- 新增子应用授权表 --何晓瑜
create table if not exists app_module_right
(
  rowguid           varchar(50)  not null primary key,
  moduleguid        varchar(50),
  allowto           varchar(50),
  allowtype         varchar(50)
);
GO

-- 新增应用授权表 --何晓瑜
create table if not exists app_right
(
  rowguid           varchar(50)  not null primary key,
  appguid    varchar(50),
  allowto    varchar(50),
  allowtype  varchar(50)
);
GO

-- 新增应用管理员表 --何晓瑜
create table if not exists app_admin_relation
(
  rowguid           varchar(50)  not null primary key,
  userguid            varchar(50),
  appguid             varchar(50)
);
GO

-- 新增应用用户范围表 --何晓瑜
create table if not exists app_user_relation
(
  rowguid           varchar(50)  not null primary key,
  allowtype           varchar(50),
  allowto             varchar(50),
  appguid             varchar(50)
);
GO

-- 新增应用角色授权表 --何晓瑜
create table if not exists app_role_relation
(
  rowguid           varchar(50)  not null primary key,
  roleguid            varchar(50),
  appguid             varchar(50)
);
GO

-- 2017/07/15
-- 新增app_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'app_id') then
    alter table app_info add column app_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增counsumer_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'consumer_id') then
       alter table app_info add column consumer_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增username--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'username') then
       alter table app_info add column username varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增api_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'api_id') then
       alter table api_info add column api_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增provisionkey--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'provisionkey') then
     alter table api_info add  column provisionkey varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增oauth_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'oauth_id') then
     alter table api_info add column oauth_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增acl_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'acl_id') then
     alter table api_info add column acl_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增api调用地址--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'api_url') then
     alter table api_info add column api_url varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增api名称编码--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'apiencodename') then
    alter table api_info add column apiencodename varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增api_subscribe_id--施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_subscribe' and column_name = 'acl_subscribe_id') then
    alter table api_subscribe add  column acl_subscribe_id varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增空同步状态
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'syncflag') then
    alter table api_info add column syncflag varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增空同步状态
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'syncflag') then
    alter table app_info add column syncflag varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增空同步异常信息
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'syncexception') then
    alter table api_info add column syncexception varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增空同步异常信息
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'syncexception') then
    alter table app_info add column syncexception varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增日志id字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'log_id') then
    alter table api_info add column log_id  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/7/17
-- 可扩展控件表新增移动模板、控件class、扩展控件一、扩展控件二四个字段---季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_extensible_control' and column_name = 'mobiletemplate') then 
   alter table epointsform_extensible_control add column mobiletemplate  varchar(500);
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
            where table_schema = database() and table_name = 'epointsform_extensible_control' and column_name = 'controlclass') then 
   alter table epointsform_extensible_control add column controlclass  varchar(50);
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
            where table_schema = database() and table_name = 'epointsform_extensible_control' and column_name = 'extendfieldone') then 
   alter table epointsform_extensible_control add column extendfieldone  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_extensible_control' and column_name = 'extendfieldtwo') then 
   alter table epointsform_extensible_control add column extendfieldtwo  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

 -- 新增同步标志位表--何晓瑜
create table if not exists app_syncflag
(  
  appkey         varchar(50) not null primary key,
  orglastupdguid varchar(50) not null
);
GO

-- 新增界面ui相关表--樊志君
-- 界面风格表
create table if not exists frame_ui 
(  
  rowguid             varchar(50) not null primary key,
  uiname              varchar(50),
  pageid              varchar(50),
  themetype           varchar(50),
  themeurl            varchar(500),
  mainprotalguid      varchar(50),
  mainpageurl         varchar(500),
  fullsearchurl       varchar(500),
  ordernumber         int,
  title               varchar(50),
  logoimage           longblob,
  logocontenttype     varchar(50),
  logoimageudpatetime datetime,
  previewimage        longblob,
  previewcontenttype  varchar(50),
  isenableexun        int,
  isdisable           int
);
GO

-- 界面风格权限表
create table if not exists frame_ui_right
( 
  rowguid   varchar(50) not null primary key,
  uiguid    varchar(50),
  allowto   varchar(50),
  allowtype varchar(50)
);
GO

-- 界面方案与模块关系表
create table if not exists frame_ui_module
( 
  rowguid   varchar(50) not null primary key,
  belonguiguid varchar(50),
  modulecode   varchar(50)
);
GO

-- 桌面表
create table if not exists frame_desk
( 
  rowguid   varchar(50) not null primary key,
  deskname          varchar(50),
  belonguiguid      varchar(50),
  desknumber        int,
  metroappinonesize varchar(50)
);
GO

-- 框架标准应用表
create table if not exists frame_app
( 
  rowguid   varchar(50) not null primary key,
  appname         varchar(50),
  moduleguid      varchar(50),
  belongdeskguid  varchar(50),
  ordernumber     int,
  imacicon        varchar(50),
  applocation     varchar(50),
  backgroudcolor  varchar(50),
  metroicon       varchar(50),
  messagecounturl varchar(500)
);
GO

-- 框架标准个人应用表
create table if not exists frame_personapp
( 
  rowguid   varchar(50) not null primary key,
  appguid        varchar(50),
  belonguserguid varchar(50),
  belongdeskguid varchar(50),
  ordernumber    int
);
GO

-- 门户表
create table if not exists frame_portal
( 
  rowguid   varchar(50) not null primary key,
  portalname  varchar(50),
  ordernumber int,
  isdisable   int,
  portaltype  int,
  portalurl   varchar(1000)
);
GO

-- 门户权限表
create table if not exists frame_portalright
( 
  rowguid   varchar(50) not null primary key,
  portalguid varchar(50),
  allowto    varchar(50),
  allowtype  varchar(50)
);
GO

-- 首页元件新增字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'portal_item' and column_name = 'belongportalguid') then 
      alter table portal_item add column belongportalguid varchar(50);
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
            where table_schema = database() and table_name = 'portal_item' and column_name = 'extrainfo') then 
      alter table portal_item add column extrainfo text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 子应用表增加字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_module' and column_name = 'belongdeskguid') then
     alter table app_module add column belongdeskguid varchar(50);
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
            where table_schema = database() and table_name = 'app_module' and column_name = 'icon') then
     alter table app_module add column icon varchar(500);
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
            where table_schema = database() and table_name = 'app_module' and column_name = 'iconcontent') then
     alter table app_module add column iconcontent longblob;
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
            where table_schema = database() and table_name = 'app_module' and column_name = 'iconcontenttype') then
     alter table app_module add column iconcontenttype varchar(50);
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
            where table_schema = database() and table_name = 'app_module' and column_name = 'iconupdatetime') then
     alter table app_module add column iconupdatetime datetime;
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
            where table_schema = database() and table_name = 'app_module' and column_name = 'messagecounturl') then
     alter table app_module add column messagecounturl varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 个人应用表
create table if not exists app_personalmodule
( 
  rowguid   varchar(50) not null primary key,
  moduleguid     varchar(50),
  belonguserguid varchar(50),
  belongdeskguid varchar(50),
  ordernumber    int,
  isdisable      int
);
GO

-- 应用元件表新增字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_element' and column_name = 'isdisable') then
     alter table app_element add column isdisable int;
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
            where table_schema = database() and table_name = 'app_element' and column_name = 'extrainfo') then
     alter table app_element add column extrainfo text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户元件对应关系表
create table if not exists app_portal_element
( 
  rowguid   varchar(50) not null primary key,
  elementguid      varchar(50),
  belongportalguid varchar(50),
  elementlocation  varchar(50)
);
GO

-- 2017/7/19
-- 新建个人应用视图--樊志君
create or replace view view_app_mymodule as
select
  pm.rowguid,
  pm.moduleguid,
  pm.belongdeskguid as mydeskguid,
  pm.belonguserguid,
  pm.ordernumber,
  pm.isdisable,
  m.appguid,
  m.icon,
  m.iconcontent,
  m.iconcontenttype,
  m.iconupdatetime,
  m.modulename,
  m.modulemenuname,
  m.moduleurl,
  m.isblank,
  m.messagecounturl
from 
  app_personalmodule pm
join app_module m on pm.moduleguid = m.moduleguid
where 
	m.isdisable = 0;
GO
	
-- 2017/7/24
-- 工作平台应用与类别视图--樊志君
create or replace view view_app_infoclass as
select
  a.rowguid,
  a.appname,
  b.appclassguid,
  b.appclassname,
  a.ordernum,
  b.ordernumber
from app_info a
left join   app_class b on  a.appclass = b.appclassguid;
GO

-- 2017/7/26
-- 工作平台界面增加字段--何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ui' and column_name = 'previewupdatetime') then 
   alter table frame_ui add column previewupdatetime datetime;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/7/27
 -- 新增个人元件门户关系表--何晓瑜
create table if not exists personal_portal_element
(  
  ptrowguid        varchar(50) not null primary key,
  isdisable        int,
  userguid         varchar(50),
  elementlocation  varchar(50)
);
GO

-- 新增个人元件门户视图--何晓瑜
create or replace view view_personal_element as
select b.elementname,
       b.elementurl,
       b.rowguid as elementguid,
       b.isdisable as elementdisable,
       a.ptrowguid,
       a.isdisable,
       a.userguid,
       c.elementlocation as initlocation,
       a.elementlocation as userlocation,
       c.belongportalguid
  from personal_portal_element a
  join app_element b join app_portal_element c
    on c.elementguid = b.rowguid and a.ptrowguid = c.rowguid;
GO
    
 
-- 2017/7/31
-- 首页元件视图修改--何晓瑜
create or replace view view_portal_myitem as
select     
     portal_myitem.rowguid as myrowguid, 
     portal_myitem.userguid, 
	   portal_item.initrow, 
	   portal_item.initcol,
	   portal_item.rowspan, 
	   portal_item.colspan,
	   portal_item.belongportalguid,
     portal_item.title,
	   portal_item.dataRows, 
	   portal_item.rowguid,
     portal_myitem.itemcol, 
	   portal_myitem.itemrow,
	   portal_myitem.rowspan as itemrowspan, 
	   portal_myitem.colspan as itemcolspan, 
	   portal_myitem.disabled,
     portal_item.url
from  portal_item inner join 
      portal_myitem ON portal_item.rowguid = portal_myitem.portaletguid
where     (portal_item.disabled = 0);
GO

-- 2017/8/2
-- 子应用表 -- 何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_module' and column_name = 'heightratio') then 
   alter table app_module add column heightratio double(18,2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_module' and column_name = 'widthratio') then 
    alter table app_module add column widthratio double(18,2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/8/3
-- 表单设计器相关表添加备用字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointform_version' and column_name = 'api_url') then 
    alter table epointform_version add column api_url  varchar(100);
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
            where table_schema = database() and table_name = 'epointform_version' and column_name = 'bak1') then 
    alter table epointform_version add column bak1  varchar(100);
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
            where table_schema = database() and table_name = 'epointform_version' and column_name = 'bak2') then 
    alter table epointform_version add column bak2  varchar(100);
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
            where table_schema = database() and table_name = 'epointsform_control_property' and column_name = 'bak1') then 
    alter table epointsform_control_property  add column bak1  varchar(100);
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
            where table_schema = database() and table_name = 'epointsform_control_property' and column_name = 'bak2') then 
    alter table epointsform_control_property  add column bak2  varchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

create table if not exists epointsform_table_category
(  categoryid   integer  not null primary key,
  categorynum   varchar(100),
  categoryname  varchar(100),
  ordernum   integer,   
  homepageurl  text,
  categoryguid  varchar(100),
  parentcategoryguid  varchar(100),
  bak1  varchar(100),
  bak2  varchar(100),
  appguid varchar(100)
);
GO

-- 表基本信息  ---季立霞
create table if not exists epointsform_table_basicinfo
(  
  tableid   integer  not null primary key,
  tableguid   varchar(100)  not null,
  tablename  varchar(100)  not null,
  sql_tablename   varchar(100),   
  tabletype  integer  not null,
  parenttableid  integer,
  categorynum  varchar(100),
  ordernum  integer,
  usepagetype  varchar(100),
  leaderviewurl  varchar(100),
  designclass  varchar(100),
  bak1  text,
  bak2  varchar(100),
  bak3  varchar(100),
  appguid varchar(100)
);
GO

-- 表结构信息  ---季立霞
create table if not exists epointsform_table_struct
(  
  fieldid   integer  not null  primary key,
  fieldname   varchar(100),
  fieldtype  varchar(100),
  fieldlength   integer,   
  fieldchinesename  varchar(100),
  todispingrid  integer,
  isforeignkey  varchar(2),
  ordernumingrid  integer,
  fielddefaultvalue  varchar(100),
  notnull  integer,
  isquerycondition  integer,
  mustfill  integer,
  datasource  longtext,
  datasource_codename  varchar(100),
  orderdirection  varchar(100),
  isorderfield  integer,
  uniquefield  integer,
  fieldindex  integer,
  tableid  integer,
  controlwidth  integer,
  defaultvalue  varchar(100),
  fieldjd  integer,
  gridwidth  integer,
  gridmultirows  integer,
  dispfielddesc  integer,
  initgetvaluesql  text,
  isexportexcel  integer,
  dispinadd  integer,
  fieldnamebasictable  varchar(300),
  fielddisplaytype  varchar(500),
  fieldnameParenttable  varchar(300),
  validcheckformula  varchar(300),
  valueurl  varchar(1024),
  basicfieldname  varchar(255),
  fielddesc  varchar(500),
  bak1  text,
  bak2  varchar(100),
  bak3  varchar(100)
);
GO

-- 2017/8/6
-- 用户为应用授权表  ---施佳炜
create table if not exists user_app_scope
(
  belongxiaqucode  varchar(50)  null,
  operateusername varchar(50) null,
  operatedate datetime null,
  row_id int(11) null,
  yearflag varchar(4) null,
  rowguid varchar(50)  not null primary key,
  loginid varchar(50) null,
  appguid varchar(50) null,
  scopeguid varchar(50) null
);
GO

-- 2017/8/10
-- 更改字段长度-- 施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'apiencodename') then 
    alter table api_info add column apiencodename  varchar(50);
else 
    alter table api_info modify column apiencodename varchar(500);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'api_url') then 
    alter table api_info add column api_url  varchar(50);
else 
    alter table api_info modify column api_url varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/8/29
-- 个人应用表增加uiguid关联字段 --樊志君
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_personalmodule' and column_name = 'uiguid') then 
    alter table app_personalmodule add column uiguid  varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 个人应用视图修改
create or replace view view_app_mymodule as
select 
  pm.rowguid,
  pm.moduleguid,
  pm.belongdeskguid as mydeskguid,
  pm.belonguserguid,
  pm.ordernumber,
  pm.isdisable,
  pm.uiguid,
  m.appguid,
  m.Icon,
  m.IconContent,
  m.IconContentType,
  m.iconupdatetime,
  m.modulename,
  m.modulemenuname,
  m.moduleurl,
  m.isblank,
  m.MessageCountUrl
from app_personalmodule pm
join app_module m on pm.moduleguid = m.moduleguid
where m.isdisable = 0;
GO

-- 2017/8/30
-- 消息表clientIdentifier字段改为2000长度 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_message' and column_name = 'clientIdentifier') then 
    alter table messages_message add column clientIdentifier varchar(2000);
 else           
    alter table messages_message modify column clientIdentifier varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/9/1
-- apiinfo表添加提交、返回示例字段 --包永廉

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'requestsample') then
    alter table api_info add column requestsample  varchar(2000);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'responsesample') then
    alter table api_info add column responsesample  varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/9/5
-- 新增ios证书表 --何晓瑜
create table if not exists messages_ios_certification
(
  rowguid              varchar(50) not null primary key,
  iosappguid           varchar(50),
  password             varchar(50),
  filename             varchar(50),
  path                 varchar(100),
  type                 varchar(10),
  uploadtime           varchar(50),
  cercontent           longblob,
  contenttype          varchar(50)
);
GO

-- 2017/9/7
-- messages_channel表增加字段 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_channel' and column_name = 'userchannelimplclass') then 
    alter table messages_channel add column userchannelimplclass varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/9/13
-- 工作流工作项表添加senderWorkItemGuid字段记录来源工作项guid--季晓伟
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_workitem' and column_name = 'senderworkitemguid') then 
    alter table workflow_workitem add column senderworkitemguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_workitem_history' and column_name = 'senderworkitemguid') then 
    alter table workflow_workitem_history add column senderworkitemguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/9/28
-- 表单版本表添加js，css存储字段---季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointform_version' and column_name = 'jscontent') then 
    alter table epointform_version add column jscontent text;
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
            where table_schema = database() and table_name = 'epointform_version' and column_name = 'csscontent') then 
    alter table epointform_version add column csscontent text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/11/8
-- 新增登录访问日志表--周志豪
create table if not exists frame_login_log (
  rowguid varchar(50) not null primary key,
  userguid varchar(50),
  loginid varchar(50),
  clientip varchar(50),
  errordescription varchar(1000),
  accesstime datetime,
  loginstate varchar(50) 
);
GO

-- 新增禁用IP记录表
create table if not exists frame_ip_lockinfo (
  rowguid varchar(50) not null primary key,
  clientip varchar(50),
  iptype varchar(50),
  ipmanagertype varchar(50)
);
GO

-- 2017/11/10
-- 统一消息移动端对接 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_rule' and column_name = 'pcurltemplate') then 
     alter table messages_rule add column pcurltemplate varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_rule' and column_name = 'mobileurltemplate') then 
     alter table messages_rule add column mobileurltemplate varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_rule' and column_name = 'mobileitem') then 
     alter table messages_rule add column mobileitem varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/11/14
-- 统一消息移动端对接 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_message' and column_name = 'clientIdentifier4') then 
      alter table messages_message add column clientIdentifier4 varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_message' and column_name = 'clientIdentifier5') then 
      alter table messages_message add column clientIdentifier5 varchar(200);
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
            where table_schema = database() and table_name = 'messages_message' and column_name = 'clientIdentifier6') then 
      alter table messages_message add column clientIdentifier6 varchar(200);
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
            where table_schema = database() and table_name = 'messages_message' and column_name = 'isnoneedremind') then 
      alter table messages_message add column isnoneedremind int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 2017/11/22
-- 用户角色关系快照表加一个字段--何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_userrole_snapshot' and column_name = 'userroleguid') then 
      alter table frame_userrole_snapshot add userroleguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/12/7 
-- 移动端设置消息是否置顶 --何晓瑜
create table if not exists messages_mobile_config
(
  rowguid              varchar(50) not null primary key,
  userid               varchar(50),
  typeguid             varchar(50),
  istop                int(11)
);
GO

-- 2017/12/21
-- 统一应用表增加字段移动页面部署地址 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'mobilepageurl') then 
      alter table app_info add mobilepageurl varchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/12/25
-- 新增服务配置表 --周志豪
create table if not exists api_config
(
   rowguid varchar(50) not null primary key,
  configname varchar(50) ,
  configvalue text,
  description text
);
GO

-- 同步日志表增加字段target
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_sync_log' and column_name = 'target') then 
      alter table api_sync_log add target int(2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 服务基本信息表增加字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'type') then 
      alter table api_info add type varchar(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'method') then 
      alter table api_info add method varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'supportcontenttype') then 
      alter table api_info add supportcontenttype varchar(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'attention') then 
      alter table api_info add attention varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'retries') then 
      alter table api_info add retries int(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'upstreamconnecttimeout') then 
      alter table api_info add upstreamconnecttimeout int(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'upstreamsendtimeout') then 
      alter table api_info add upstreamsendtimeout int(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'upstreamreadtimeout') then 
      alter table api_info add upstreamreadtimeout int(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'httpsonly') then 
      alter table api_info add httpsonly varchar(50);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'httpifterminated') then 
      alter table api_info add httpifterminated varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'stripuri') then 
      alter table api_info add stripuri varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'preservehost') then 
      alter table api_info add preservehost varchar(50);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'createdate') then 
      alter table api_info add createdate datetime;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'updatedate') then 
      alter table api_info add updatedate datetime;
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'runstate') then 
      alter table api_info add runstate varchar(2);
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
            where table_schema = database() and table_name = 'api_info' and column_name = 'plugininfo') then 
      alter table api_info add plugininfo text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增请求参数表
create table if not exists api_request_params
(
  rowguid varchar(50) not null primary key,
  apiguid varchar(50),
  name varchar(100),
  type varchar(50),
  ismust varchar(2),
  ordernumber int(11),
  description varchar(2000),
  paramstype varchar(50)
);
GO

-- 2017/12/27
-- 施佳炜 
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'supportcontenttype') then 
    alter table api_info add column supportcontenttype varchar(50);
else 
    alter table api_info modify column supportcontenttype varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'monitorurl') then 
      alter table api_info add monitorurl varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'monitoruser') then 
      alter table api_info add monitoruser varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'monitorpassword') then 
      alter table api_info add monitorpassword varchar(50);
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
            where table_schema = database() and table_name = 'api_runtime_log' and column_name = 'apiguid') then 
      alter table api_runtime_log add apiguid varchar(50); 
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 2017/12/29
-- 增加系统参数脚本 --wy
drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from  frame_config where ConfigName = 'VisitLog') then
 insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) 
  Values('6915c092-ab9f-426c-9545-bee4125eb12e','VisitLog','0','设置是否需要记录访问日志，设置1为需要记录',null,null,'e01bbd72-c469-44e8-8165-217787156f5f',0) ;
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO

drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from  frame_config where ConfigName = 'SystemName') then
 insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values ('369658ac-8209-45c1-8837-c1cff2d57cea', 'SystemName', '新点应用集成平台', '系统名称', '349', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO

drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from  frame_config where ConfigName = 'LoginLogoImage') then
 insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values ('6de6299a-8115-44b9-b2af-4acf9d6d2853', 'LoginLogoImage', 'frame/pages/login/images/login-title-zcpt.png', NULL, '0', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO

-- 附件信息是否加密-- 严璐琛
drop procedure if exists`epoint_proc_alter`;
GO
create procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'isencrypt') then 
      alter table frame_attachinfo add  isencrypt int(11); 
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
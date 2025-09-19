-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2017/5/27
-- frame_workingday增加一个字段 --施佳炜
if not exists (select name from syscolumns  where id = object_id('frame_workingday') and name='lunar' ) 
alter table frame_workingday add lunar  nvarchar(50); 
GO

-- frame_workingday增加一个字段 --施佳炜
if not exists (select name from syscolumns  where id = object_id('frame_workingday') and name='isfestival' ) 
alter table frame_workingday add isfestival  nvarchar(50); 
GO

-- 2017/5/27
-- 工作日相关 --何晓瑜
-- 节假日信息表
if not exists (select * from dbo.sysobjects where id = object_id('frame_festival'))
create table frame_festival
(
  rowguid           varchar(50) not null primary key,
  festivalname      varchar(50),
  starttime         date,
  endtime           date,
  takeoffday        varchar(50),
  currentyear       int
);
GO

-- 2017/6/7
-- frame_workingday和frame_festival各增加一个字段 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('frame_workingday') and name='isfestival' ) 
alter table frame_workingday add isfestival  int;
GO

if not exists (select name from syscolumns  where id = object_id('frame_festival') and name='festivaltime' ) 
alter table frame_festival add festivaltime  nvarchar(50);
GO

--新增可扩展控件属性表 --季立霞
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_control_property'))
create table epointsform_control_property
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

--新增可扩展控件表    --季立霞
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_extensible_control'))
create table epointsform_extensible_control
(
  controlguid varchar(50)  not null,
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

-- 2017/6/13
-- 元件表新增字段--樊志君
if not exists (select name from syscolumns  where id = object_id('portal_item') and name='rowspan' ) 
alter table portal_item add rowspan  int;
GO

if not exists (select name from syscolumns  where id = object_id('portal_item') and name='colspan' ) 
alter table portal_item add colspan  int;
GO

if not exists (select name from syscolumns  where id = object_id('portal_item') and name='url' ) 
alter table portal_item add url  nvarchar(500);
GO

-- 个人元件表新增字段--樊志君
if not exists (select name from syscolumns  where id = object_id('portal_myitem') and name='rowspan' ) 
alter table portal_myitem add rowspan  int;
GO

if not exists (select name from syscolumns  where id = object_id('portal_myitem') and name='colspan' ) 
alter table portal_myitem add colspan  int;
GO

-- 2017/6/19
--  王颜
  if not exists (select name from syscolumns  where id = object_id('portal_item') and name='belongportalguid' ) 
  alter table portal_item add  belongportalguid  varchar(50);
  GO
  
-- 首页元件视图修改--樊志君
if exists   (select * from sys.views where object_id= object_id('view_portal_myitem'))
drop view view_portal_myitem
GO
create view view_portal_myitem as
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
if not exists (select name from syscolumns  where id = object_id('frame_user') and name='updatepwd' ) 
alter table frame_user add updatepwd datetime;
update frame_user set updatepwd =getdate();
GO

-- 2017/7/6
-- 新增物理表api_class(服务类别) 施佳炜
if not exists (select * from dbo.sysobjects where id = object_id('api_class'))
create table  api_class
(
   belongxiaqucode nvarchar(50) null,
   operateusername nvarchar(50) null,
   operatedate datetime null,
   row_id integer null,
   yearflag nvarchar(4) null,
   rowguid nvarchar(50) not null primary key,
   apiclassguid nvarchar(50) null,
   apiclassname nvarchar(100) not null,
   apiclassremark nvarchar(1000) null,
   ordernumber integer null,
   apiclassparentguid nvarchar(100) null
);
GO

-- 新增物理表api_scope(方法别名) 施佳炜
if not exists (select * from dbo.sysobjects where id = object_id('api_scope'))
create table api_scope
( 
   belongxiaqucode nvarchar(50) null,
   operateusername nvarchar(50) null,
   operatedate datetime null,
   row_id integer null,
   yearflag nvarchar(4) null,
   rowguid nvarchar(50) not null primary key,
   scopeguid nvarchar(50) null,
   scopename nvarchar(50) null,
   description nvarchar(200) null,
   ordernum integer null,
   scopekey nvarchar(50) null
);
GO

-- 新增物理表api_info(服务基本信息) 施佳炜
if not exists (select * from dbo.sysobjects where id = object_id('api_info'))
create table api_info
( 
  belongxiaqucode nvarchar(50) null,
  operateusername nvarchar(50) null,
  operatedate datetime null,
  row_id integer null,
  yearflag nvarchar(4) null,
  rowguid nvarchar(50) not null primary key,
  apiguid nvarchar(50) null,
  apiname nvarchar(200) null,
  categoryid nvarchar(100) null,
  status nvarchar(50) null,
  description nvarchar(200) null,
  apirealurl nvarchar(100) null, 
  urlpattern nvarchar(500) null,
  userauth nvarchar(50) null, 
  clientauth nvarchar(50) null
);
GO

-- 新增物理表API_SCOPE_RELATION(方法scope关联表实体) 施佳炜 
if not exists (select * from dbo.sysobjects where id = object_id('api_scope_relation'))
create table api_scope_relation
( 
   belongxiaqucode nvarchar(50) null,
  operateusername nvarchar(50) null,
  operatedate datetime null,
  row_id integer null,
  yearflag nvarchar(2) null,
  rowguid nvarchar(50) not null primary key,
  apiguid nvarchar(50) null,
  scopeguid nvarchar(50) null
);
GO

-- 添加数据表api_log(api日志表)
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_log'))
create table api_runtime_log
( 
   belongxiaqucode nvarchar(50) null,
   operateusername nvarchar(50) null,
   operatedate datetime null,
   row_id integer null,
   yearflag nvarchar(4) null,
   rowguid nvarchar(50)  not null primary key,
   startat datetime null,
   method nvarchar(50) null,
   requestsize float null,
   consumer nvarchar(50) null,
   clientip nvarchar(50) null,
   responsesize float null,
   status integer  null,
   forwardtime integer null,
   requesttime integer null,
   requesturl nvarchar(500) null,
   context text null,
   apiid nvarchar(50) null,
   apiname nvarchar(50) null
);
GO

-- 创建数据表API_SYNC_LOG
if not exists (select * from dbo.sysobjects where id = object_id('api_sync_log'))
create table api_sync_log
( 
  belongxiaqucode nvarchar(50) null,
   operateusername nvarchar(50) null,
   operatedate datetime null,
   row_id integer null,
   yearflag nvarchar(2) null,
   rowguid nvarchar(50) not null primary key,
   type nvarchar(50) null,
   recorddate datetime null,
   status text null,
   description nvarchar(1000) null,
   clientid nvarchar(50) null
);
GO


-- 2017/7/12
-- 新增应用类别表--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_class'))
create table app_class
( 
  appclassguid         nvarchar(50) not null primary key,
  appclassname         nvarchar(50),
  appclassremark       nvarchar(200),
  ordernumber          nvarchar(50),
  appclassparentguid   nvarchar(50),
  appplat              nvarchar(50)
);
GO

-- 新增应用表--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_info'))
create table app_info
( 
 rowguid               nvarchar(50) not null primary key,
  appkey                nvarchar(50),
  appsecret             nvarchar(50),
  appname               nvarchar(100),
  callbackurl           nvarchar(1000),
  approoturl            nvarchar(1000),
  appconfigurl          nvarchar(1000),
  apptype               nvarchar(50),
  appstatus             nvarchar(50),
  createdate            datetime,
  binddomain            nvarchar(50),
  appentryname          nvarchar(50),
  apprealurl            nvarchar(1000),
  appclass              nvarchar(50),
  appicon_b             nvarchar(50),
  appicon_s             nvarchar(50),
  metrocolspan          float,
  metrorowspan          float,
  metrobgcolor          nvarchar(50),
  metroinnerurl         nvarchar(500),
  metroisblank          nvarchar(1),
  iosisblank            nvarchar(1),
  metropageindex        integer,
  metrohowindex         float,
  scope                 nvarchar(100),
  granttypes             nvarchar(100),
  accesstokenvalidity   integer,
  refreshtokenvalidity  integer,
  archived              float,
  trusted               float,
  iosappwindowwidth     float,
  iosappwindowheight    float,
  metroappwindowwidth   float,
  metroappwindowheight  float,
  iospageindex          integer,
  iosshowindex          float,
  appdesc               nvarchar(255),
  ssoindex              nvarchar(50),
  ordernum              integer
);
GO

-- 新增服务订阅表--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('api_subscribe'))
create table api_subscribe
( 
 rowguid             nvarchar(50) not null primary key,
  apiguid             nvarchar(50),
  appguid             nvarchar(50),
  isenable            integer,
  refuse              nvarchar(50)
);
GO

-- 新增服务订阅视图 --何晓瑜
if exists   (select * from sys.views where object_id= object_id('view_subscribed_api'))
drop view view_subscribed_api
GO
create view view_subscribed_api as
select b.apiguid,
       b.categoryid,
       b.status,
       b.description,
       b.apiname,
       a.isenable,
       a.refuse,
       a.appguid,
       a.rowguid
  from api_subscribe a
  join api_info b
    on a.apiguid = b.rowguid;
GO

-- 新增方法授权视图 --何晓瑜
if exists   (select * from sys.views where object_id= object_id('view_auth_api'))
drop view view_auth_api
GO
create  view view_auth_api as
select b.appclass,
       b.appname,
       b.appkey,
       a.appguid,
       a.isenable,
       a.refuse,
       a.apiguid,
       a.rowguid
  from api_subscribe a
  join app_info b
    on a.appguid = b.rowguid;
GO

-- 新增元件表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_element'))
create table app_element
( 
  rowguid                 nvarchar(50) not null primary key,
  appguid                 nvarchar(50),
  elementname             nvarchar(50),
  elementurl              nvarchar(50),
  elementdesc             nvarchar(200),
  identityname            nvarchar(50),
  ordernum                integer,
  positiontop             integer,
  positionleft            integer,
  width                   integer,
  height                  integer,
  linkapp                 nvarchar(50),
  allowclosebutton        integer,
  appstatus               integer,
  isinit                  integer,
  userconfigurl             nvarchar(50),
  thumbnail                 nvarchar(50),
  picturebig                nvarchar(50),
  desktopcreateappstoreicon nvarchar(50),
  pageindex                integer
);
GO

-- 新增元件授权表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_element_right'))
create table app_element_right
( 
  rowguid             nvarchar(50) not null primary key,
  allowtype           nvarchar(50),
  allowto             nvarchar(50),
  elementguid         nvarchar(50)
);
GO

-- 新增子应用表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_module'))
create table app_module
( 
moduleguid           nvarchar(50)  not null primary key,
  appguid              nvarchar(50),
  modulecode           nvarchar(50),
  modulename           nvarchar(50),
  modulemenuname       nvarchar(50),
  ordernumber           integer,
  isdisable             integer,
  isblank               integer,
  bigiconaddress       nvarchar(100),
  smalliconaddress     nvarchar(100),
  appkey               nvarchar(50),
  showinportal          integer,
  moduleurl            nvarchar(500),
  needsync              integer,
  metrocolspan          integer,
  metrorowspan          integer,
  metrobgcolor         nvarchar(50),
  metroinnerurl        nvarchar(500),
  metroappwindowwidth  float,
  metroappwindowheight float,
  metroisblank         nvarchar(1),
  iosisblank           nvarchar(1),
  metropageindex        integer,
  metroshowindex        integer,
  iosappwindowwidth    float,
  iosappwindowheight   float,
  iospageindex          integer,
  iosshowindex          integer
);
GO

-- 新增子应用授权表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_module_right'))
create table app_module_right
( 
rowguid           nvarchar(50)  not null primary key,
  moduleguid        nvarchar(50),
  allowto           nvarchar(50),
  allowtype         nvarchar(50)
);
GO

-- 新增应用授权表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_right'))
create table app_right
( 
  rowguid    nvarchar(50)  not null primary key,
  appguid    nvarchar(50),
  allowto    nvarchar(50),
  allowtype  nvarchar(50)
);
GO

-- 新增应用管理员表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_admin_relation'))
create table app_admin_relation
( 
  rowguid           nvarchar(50)  not null primary key,
  userguid            nvarchar(50),
  appguid             nvarchar(50)
);
GO

--新增应用用户范围表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_user_relation'))
create table app_user_relation
( 
  rowguid           nvarchar(50)  not null primary key,
  allowtype           nvarchar(50),
  allowto             nvarchar(50),
  appguid             nvarchar(50)
);
GO

--新增应用角色授权表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_role_relation'))
create table app_role_relation
( 
  rowguid           nvarchar(50)  not null primary key,
  roleguid            nvarchar(50),
  appguid             nvarchar(50)
);
GO

-- 2017/07/15
-- 新增app_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('app_info') and name='app_id' ) 
alter table app_info add app_id varchar(50);
GO
-- 新增counsumer_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('app_info') and name='consumer_id' ) 
alter table app_info add consumer_id varchar(50);
GO
-- 新增username--施佳炜
if not exists (select name from syscolumns  where id = object_id('app_info') and name='username' ) 
alter table app_info add username varchar(50);
GO
-- 新增api_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='api_id' ) 
alter table api_info add api_id varchar(50);
GO
-- 新增provisionkey--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='provisionkey' ) 
alter table api_info add provisionkey varchar(50);
GO
-- 新增oauth_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='oauth_id' ) 
alter table api_info add oauth_id varchar(50);
GO
-- 新增acl_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='acl_id' ) 
alter table api_info add acl_id varchar(50);
GO
-- 新增api调用地址--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='api_url' ) 
alter table api_info add api_url varchar(50);
GO
-- 新增api名称编码--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='apiencodename' ) 
alter table api_info add apiencodename varchar(50);
GO
-- 新增api_subscribe_id--施佳炜
if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='acl_subscribe_id' ) 
alter table api_subscribe add acl_subscribe_id varchar(50);
GO
-- 新增空同步状态
if not exists (select name from syscolumns  where id = object_id('api_info') and name='syncflag' ) 
alter table api_info add syncflag varchar(50);
GO
-- 新增空同步状态
if not exists (select name from syscolumns  where id = object_id('app_info') and name='syncflag' ) 
alter table app_info add syncflag varchar(50);
GO
-- 新增空同步异常信息
if not exists (select name from syscolumns  where id = object_id('api_info') and name='syncexception' ) 
alter table api_info add syncexception varchar(2000);
GO
-- 新增空同步异常信息
if not exists (select name from syscolumns  where id = object_id('app_info') and name='syncexception' ) 
alter table app_info add syncexception varchar(2000);
GO
-- 新增日志id字段
if not exists (select name from syscolumns  where id = object_id('api_info') and name='log_id' ) 
alter table api_info add  log_id  varchar(50);
GO

-- 2017/7/17
-- 可扩展控件表新增移动模板、控件class、扩展控件一、扩展控件二四个字段---季立霞
if not exists (select name from syscolumns  where id = object_id('epointsform_extensible_control') and name='mobiletemplate' ) 
alter table epointsform_extensible_control add mobiletemplate  varchar(500);
GO
if not exists (select name from syscolumns  where id = object_id('epointsform_extensible_control') and name='controlclass' ) 
alter table epointsform_extensible_control add controlclass  varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('epointsform_extensible_control') and name='extendfieldone' ) 
alter table epointsform_extensible_control add extendfieldone  varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('epointsform_extensible_control') and name='extendfieldtwo' ) 
alter table epointsform_extensible_control add extendfieldtwo  varchar(50);
GO

-- 新增同步标志位表--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('app_syncflag'))
create table app_syncflag
( 
  appkey         varchar(50) not null primary key,
  orglastupdguid varchar(50) not null
);
GO

-- 新增界面ui相关表--樊志君
-- 界面风格表
if not exists (select * from dbo.sysobjects where id = object_id('frame_ui'))
create table frame_ui
( 
  rowguid             varchar(50) not null primary key,
  uiname              varchar(50),
  pageid              varchar(50),
  themetype           varchar(50),
  themeurl            varchar(500),
  mainprotalguid      varchar(50),
  mainpageurl         varchar(500),
  fullsearchurl       varchar(500),
  ordernumber         integer,
  title               varchar(50),
  logoimage           image,
  logocontenttype     varchar(50),
  logoimageudpatetime datetime,
  previewimage        image,
  previewcontenttype  varchar(50),
  isenableexun        integer,
  isdisable           integer
);
GO

-- 界面风格权限表
if not exists (select * from dbo.sysobjects where id = object_id('frame_ui_right'))
create table frame_ui_right
( 
  rowguid   varchar(50) not null primary key,
  uiguid    varchar(50),
  allowto   varchar(50),
  allowtype varchar(50)
);
GO

-- 界面方案与模块关系表
if not exists (select * from dbo.sysobjects where id = object_id('frame_ui_module'))
create table frame_ui_module
( 
  rowguid   varchar(50) not null primary key,
  belonguiguid varchar(50),
  modulecode   varchar(50)
);
GO

-- 桌面表
if not exists (select * from dbo.sysobjects where id = object_id('frame_desk'))
create table frame_desk
( 
  rowguid   varchar(50) not null primary key,
  deskname          varchar(50),
  belonguiguid      varchar(50),
  desknumber        integer,
  metroappinonesize varchar(50)
);
GO

-- 框架标准应用表
if not exists (select * from dbo.sysobjects where id = object_id('frame_app'))
create table frame_app
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
if not exists (select * from dbo.sysobjects where id = object_id('frame_personapp'))
create table frame_personapp
( 
  rowguid   varchar(50) not null primary key,
  appguid        varchar(50),
  belonguserguid varchar(50),
  belongdeskguid varchar(50),
  ordernumber    integer
);
GO

-- 门户表
if not exists (select * from dbo.sysobjects where id = object_id('frame_portal'))
create table frame_portal
( 
  rowguid   varchar(50) not null primary key,
  portalname  varchar(50),
  ordernumber integer,
  isdisable   integer,
  portaltype  integer,
  portalurl   varchar(1000)
);
GO

-- 门户权限表
if not exists (select * from dbo.sysobjects where id = object_id('frame_portalright'))
create table frame_portalright
( 
  rowguid   varchar(50) not null primary key,
  portalguid varchar(50),
  allowto    varchar(50),
  allowtype  varchar(50)
);
GO

-- 首页元件新增字段
if not exists (select name from syscolumns  where id = object_id('portal_item') and name='belongportalguid' ) 
 alter table portal_item add  belongportalguid varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('portal_item') and name='extrainfo' ) 
 alter table portal_item add extrainfo ntext;
GO

-- 子应用表增加字段
if not exists (select name from syscolumns  where id = object_id('app_module') and name='belongdeskguid' ) 
alter table app_module add belongdeskguid nvarchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='icon' ) 
alter table app_module add icon nvarchar(500);
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='iconcontent' ) 
alter table app_module add iconcontent image;
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='iconcontenttype' ) 
alter table app_module add iconcontenttype nvarchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='iconupdatetime' ) 
alter table app_module add iconupdatetime date;
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='messagecounturl' ) 
alter table app_module add messagecounturl nvarchar(500);
GO

-- 个人应用表
if not exists (select * from dbo.sysobjects where id = object_id('app_personalmodule'))
create table app_personalmodule
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
if not exists (select name from syscolumns  where id = object_id('app_element') and name='isdisable' ) 
alter table app_element add  isdisable int;
GO
if not exists (select name from syscolumns  where id = object_id('app_element') and name='extrainfo' ) 
alter table app_element add  extrainfo text;
GO

-- 门户元件对应关系表
if not exists (select * from dbo.sysobjects where id = object_id('app_portal_element'))
create table app_portal_element
( 
  rowguid   varchar(50) not null primary key,
  elementguid      varchar(50),
  belongportalguid varchar(50),
  elementlocation  varchar(50)
);
GO

-- 2017/7/19
-- 新建个人应用视图--樊志君
if exists   (select * from sys.views where object_id= object_id('view_app_mymodule'))
drop view view_app_mymodule
GO
create  view view_app_mymodule as
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
if exists   (select * from sys.views where object_id= object_id('view_app_infoclass'))
drop view view_app_infoclass
GO
create  view view_app_infoclass as
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
--工作平台界面增加字段--何晓瑜
if not exists (select name from syscolumns  where id = object_id('frame_ui') and name='previewupdatetime' ) 
alter table frame_ui add previewupdatetime date;
GO
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='initgetvaluesql' ) 
alter table table_struct add  initgetvaluesql bigint;
GO

-- 2017/7/27
-- 新增个人元件门户关系表--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('personal_portal_element'))
create table personal_portal_element
( 
  ptrowguid        varchar(50) not null primary key,
  isdisable        int,
  userguid         varchar(50),
  elementlocation  varchar(50)
);
GO

--新增个人元件门户视图--何晓瑜
if exists   (select * from sys.views where object_id= object_id('view_personal_element'))
drop view view_personal_element
GO
create  view view_personal_element as
select 
       a.ptrowguid,
       a.isdisable,
       a.userguid,
       a.elementlocation as userlocation,
       b.elementname,
       b.elementurl,
       b.isdisable as elementdisable,
       b.rowguid as elementguid,
       c.elementlocation as initlocation,
       c.belongportalguid
  from 
   app_portal_element c
  join personal_portal_element a  on a.ptrowguid=c.rowguid
  join app_element b on c.elementguid=b.rowguid;
GO

-- 2017/7/31
-- 首页元件视图修改--何晓瑜
if exists   (select * from sys.views where object_id= object_id('view_portal_myitem'))
drop view view_portal_myitem
GO
create  view view_portal_myitem as
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

-- 2017/8/1
-- 创建数据表FRAME_OU_E_SNAPSHOT --施佳炜
if not exists (select * from dbo.sysobjects where id = object_id('frame_ou_e_snapshot'))
create table frame_ou_e_snapshot
( 
   ouguid         nvarchar(50) not null,
   isindependence int null,
   oufax          nvarchar(50) null,
   oucertguid     nvarchar(50) null,
   oucertcontent  image null,
   oucertname     nvarchar(50) null,
   individuationimgpath ntext null,
   appkey         nvarchar(50) null,
   rowguid nvarchar(50) not null,
   clientip nvarchar(50) null,
   tenantguid nvarchar(50) null
);
GO

-- 创建数据表FRAME_OU_SNAPSHOT
if not exists (select * from dbo.sysobjects where id = object_id('frame_ou_snapshot'))
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
    ordernumberfull nvarchar(500) null,
    appkey nvarchar(50) null,
    rowguid nvarchar(50) not null,
    clientip nvarchar(50) null,
    tenantguid nvarchar(50) null,
    bussinessoucode nvarchar(127) null,
    row_id int null
);
GO

-- 新增物理表FRAME_ROLE_SNAPSHOT(Frame_Role_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_role_snapshot'))
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
   rowguid nvarchar(50) not null,
   clientip nvarchar(50) null
);
GO

-- 添加数据表FRAME_ROLETYPE_SNAPSHOT(Frame_RoleType_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_roletype_snapshot'))
create table frame_roletype_snapshot
( 
   roletypeguid     nvarchar(50) not null,
   roletypename     nvarchar(50) null,
   ordernumber      int null,
   belongbaseouguid nvarchar(50) null,
   appkey           nvarchar(50) null,
   rowguid          nvarchar(50) not null,
   clientip         nvarchar(50) null
);
GO

-- 新增物理表FRAME_SECONDOU_SNAPSHOT(Frame_SecondOU_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_secondou_snapshot'))
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
    rowguid          nvarchar(50) not null
);
GO

-- 新增物理表Frame_User_E_SnapShot(Frame_User_E_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_user_e_snapshot'))
create table frame_user_e_snapshot
( 
   row_id int null,
   userguid nvarchar(50) not null,
   usbkey nvarchar(50) null,
   birthday datetime null,
   qqnumber nvarchar(50) null,
   msnnumber nvarchar(50) null,
   piccontent image null,
   piccontenttype nvarchar(50) null,
   postaladdress nvarchar(50) null,
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
   loginip ntext null,
   shortmobile nvarchar(50) null,
   appkey nvarchar(50) null,
   rowguid nvarchar(50) not null primary key,
   clientip nvarchar(50) null,
   tenantguid nvarchar(50) null,
   carnum nvarchar(50) null
);
GO

-- 新增物理表FRAME_USERROLE_SNAPSHOT(Frame_UserRole_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_userrole_snapshot'))
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
GO

-- 新增物理表FRAME_USER_SNAPSHOT(Frame_User_SnapShot)
if not exists (select * from dbo.sysobjects where id = object_id('frame_user_snapshot'))
create table frame_user_snapshot
( 
  userguid    nvarchar(50) not null,
  loginid     nvarchar(50) not null,
  password    nvarchar(50) null,
  ouguid      nvarchar(50) null,
  displayname nvarchar(50) not null,
  isenabled   int null,
  title       nvarchar(50) null,
  leaderguid  nvarchar(50) null,
  ordernumber int null,
  telephoneoffice nvarchar(50) null,
  mobile       nvarchar(50) null,
  email        nvarchar(50) null,
  description  nvarchar(50) null,
  telephonehome  nvarchar(50) null,
  fax          nvarchar(50) null,
  allowuseemail int null,
  sex          nvarchar(50) null,
  oucodelevel  nvarchar(500) null,
  updatetime datetime null,
  row_id int null,
  firstname nvarchar(50) null,
  middlename nvarchar(50) null,
  lastname nvarchar(50) null,
  prelang nvarchar(50) null,
  timezone nvarchar(50) null,
  adloginid nvarchar(50) null,
  appkey nvarchar(50) null,
  rowguid nvarchar(50) not null,
  clientip nvarchar(50) null,
  tenantguid nvarchar(50) null,
  updatepwd datetime null
);
GO

-- 2017/8/2
-- 子应用表 -- 何晓瑜
if not exists (select name from syscolumns  where id = object_id('app_module') and name='heightratio' ) 
alter table app_module add heightratio numeric(18,2);
GO
if not exists (select name from syscolumns  where id = object_id('app_module') and name='widthratio' ) 
alter table app_module add widthratio numeric(18,2);
GO

-- 2017/8/3
-- 表单设计器相关表添加备用字段
if not exists (select name from syscolumns  where id = object_id('epointform_version') and name='updatetime' ) 
alter table epointform_version add  updatetime  varchar(100);
GO
if not exists (select name from syscolumns  where id = object_id('epointform_version') and name='bak1' ) 
alter table epointform_version add  bak1  varchar(100);
GO
if not exists (select name from syscolumns  where id = object_id('epointform_version') and name='bak2' ) 
alter table epointform_version add  bak2  varchar(100);
GO
if not exists (select name from syscolumns  where id = object_id('epointsform_control_property') and name='bak1' ) 
alter table epointsform_control_property  add  bak1  varchar(100);
GO
if not exists (select name from syscolumns  where id = object_id('epointsform_control_property') and name='bak2' ) 
alter table epointsform_control_property  add  bak2  varchar(100);
GO

-- 表分类信息  ---季立霞
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_table_category'))
create table epointsform_table_category
(
  categoryid   integer  not null primary key,
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
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_table_basicinfo'))
create table epointsform_table_basicinfo
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

if not exists (select * from dbo.sysobjects where id = object_id('epointsform_table_struct'))
create table epointsform_table_struct
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
  datasource  text,
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
if not exists (select * from dbo.sysobjects where id = object_id('user_app_scope'))
create table user_app_scope
(
  belongxiaqucode  nvarchar(50)  null,
  operateusername nvarchar(50) null,
  operatedate datetime null,
  row_id int null,
  yearflag nvarchar(4) null,
  rowguid nvarchar(50)  not null primary key,
  loginid nvarchar(50) null,
  appguid nvarchar(50) null,
  scopeguid nvarchar(50) null
);
GO

-- 2017/8/10
-- 更改字段长度-- 施佳炜
if not exists (select name from syscolumns  where id = object_id('api_info') and name='apiencodename' ) 
alter table api_info add apiencodename varchar(500);  
else
alter table api_info 
alter column apiencodename varchar(500);  
GO
if not exists (select name from syscolumns  where id = object_id('api_info') and name='api_url' ) 
alter table api_info add api_url varchar(500);   
else
alter table api_info 
alter column api_url varchar(500);   
GO

-- 2017/8/29
-- 个人应用表增加uiguid关联字段 --樊志君
if not exists (select name from syscolumns  where id = object_id('app_personalmodule') and name='uiguid' ) 
alter table app_personalmodule add  uiguid  varchar(50);
GO

-- 个人应用视图修改
if exists   (select * from sys.views where object_id= object_id('view_app_mymodule'))
drop view view_app_mymodule
GO
create view view_app_mymodule as
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
from
  app_personalmodule pm
join app_module m on pm.moduleguid = m.moduleguid
where
	m.isdisable = 0;
GO

-- 2017/8/30
-- 消息表clientIdentifier字段改为2000长度 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='clientIdentifier' ) 
alter table messages_message add clientIdentifier varchar(2000)
else
alter table messages_message
alter column clientIdentifier varchar(2000);
GO

-- 2017/9/1
-- apiinfo表添加提交、返回示例字段 --包永廉
if not exists (select name from syscolumns  where id = object_id('api_info') and name='requestsample' ) 
alter table api_info add  requestsample  varchar(2000);
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='responsesample' ) 
alter table api_info add  responsesample  varchar(2000);
GO


-- 2017/9/5
-- 新增ios证书表 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('messages_ios_certification'))
create table messages_ios_certification
(
  rowguid              varchar(50) not null primary key,
  iosappguid           varchar(50),
  password             varchar(50),
  filename             varchar(50),
  path                 varchar(100),
  type                 varchar(10),
  uploadtime           datetime,
  cercontent           image,
  contenttype          varchar(50)
);
GO

-- 2017/9/7
-- messages_channel表增加字段 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_channel') and name='userchannelimplclass' ) 
alter table messages_channel add userchannelimplclass varchar(200);
GO


-- 2017/9/13
-- 工作流工作项表添加senderWorkItemGuid字段记录来源工作项guid--季晓伟
if not exists (select name from syscolumns  where id = object_id('workflow_workitem') and name='senderworkitemguid' ) 
alter table workflow_workitem add senderworkitemguid nvarchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('workflow_workitem_history') and name='senderworkitemguid' ) 
alter table workflow_workitem_history add senderworkitemguid nvarchar(50);
GO

-- 2017/9/28
-- 表单版本表添加js，css存储字段---季立霞
if not exists (select name from syscolumns  where id = object_id('epointform_version') and name='jscontent' ) 
alter table epointform_version add jscontent text;
GO
if not exists (select name from syscolumns  where id = object_id('epointform_version') and name='csscontent' ) 
alter table epointform_version add csscontent text;
GO

-- 2017/11/8
-- 新增登录访问日志表--周志豪
if not exists (select * from dbo.sysobjects where id = object_id('frame_login_log'))
create table  frame_login_log
(
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
if not exists (select * from dbo.sysobjects where id = object_id('frame_ip_lockinfo'))
create table  frame_ip_lockinfo
(
  rowguid varchar(50) not null primary key,
  clientip varchar(50),
  iptype varchar(50),
  ipmanagertype varchar(50)
);
GO


-- 2017/11/10
-- 统一消息移动端对接 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_rule') and name='pcurltemplate' ) 
alter table messages_rule add pcurltemplate varchar(2000);
GO
if not exists (select name from syscolumns  where id = object_id('messages_rule') and name='mobileurltemplate' ) 
alter table messages_rule add mobileurltemplate varchar(2000);
GO
if not exists (select name from syscolumns  where id = object_id('messages_rule') and name='mobileitem' ) 
alter table messages_rule add mobileitem varchar(2000);
GO

-- 2017/11/14
-- 统一消息移动端对接 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='clientIdentifier4' ) 
alter table messages_message add  clientIdentifier4 varchar(200);
GO
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='clientIdentifier5' ) 
alter table messages_message add clientIdentifier5 varchar(200);
GO
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='clientIdentifier6' ) 
alter table messages_message add clientIdentifier6 varchar(200);
GO
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='isnoneedremind' ) 
alter table messages_message add isnoneedremind integer;
GO

-- 2017/11/22
-- 用户角色关系快照表加一个字段--何晓瑜
if not exists (select name from syscolumns  where id = object_id('frame_userrole_snapshot') and name='userroleguid' ) 
alter table frame_userrole_snapshot add userroleguid varchar(50);
GO

-- 2017/12/7
-- 移动端设置消息是否置顶 --何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('messages_mobile_config'))
create table  messages_mobile_config
(
  rowguid              varchar(50) not null primary key,
  userid               varchar(50),
  typeguid             varchar(50),
  istop                int
);
GO

-- 2017/12/21
-- 统一应用表增加字段移动页面部署地址 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('app_info') and name='mobilepageurl' ) 
alter table app_info add mobilepageurl varchar(100);
GO

-- 2017/12/25
-- 新增服务配置表 --周志豪
if not exists (select * from dbo.sysobjects where id = object_id('api_config'))
create table  api_config
(
  rowguid nvarchar(50) not null primary key,
  configname varchar(50) ,
  configvalue text,
  description text
);
GO

-- 同步日志表增加字段target 
if not exists (select name from syscolumns  where id = object_id('api_sync_log') and name='target' ) 
alter table api_sync_log add target int;
GO


-- 服务基本信息表增加字段 
if not exists (select name from syscolumns  where id = object_id('api_info') and name='type' ) 
alter table api_info add type varchar(2);
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='method' ) 
alter table api_info add method varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='supportcontenttype' ) 
alter table api_info add supportcontenttype varchar(2);
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='attention' ) 
alter table api_info add attention varchar(2000); 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='retries' ) 
alter table api_info add retries int; 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='upstreamconnecttimeout' ) 
alter table api_info add upstreamconnecttimeout int; 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='upstreamsendtimeout' ) 
alter table api_info add upstreamsendtimeout int; 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='upstreamreadtimeout' ) 
alter table api_info add upstreamreadtimeout int; 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='httpsonly' ) 
alter table api_info add httpsonly varchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='httpifterminated' ) 
alter table api_info add httpifterminated varchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='stripuri' ) 
alter table api_info add stripuri varchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='preservehost' ) 
alter table api_info add preservehost varchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_info') and name='createdate' ) 
alter table api_info add createdate datetime; 
GO 

if not exists (select name from syscolumns  where id = object_id('api_info') and name='updatedate' ) 
alter table api_info add updatedate datetime; 
GO 
 
if not exists (select name from syscolumns  where id = object_id('api_info') and name='runstate' ) 
alter table api_info add runstate varchar(2); 
GO 

if not exists (select name from syscolumns  where id = object_id('api_info') and name='plugininfo' ) 
alter table api_info add plugininfo text; 
GO 

-- 新增请求参数表
if not exists (select * from dbo.sysobjects where id = object_id('api_request_params'))
create table  api_request_params
(
  rowguid varchar(50) not null primary key,
  apiguid varchar(50),
  name varchar(100),
  type varchar(50),
  ismust varchar(2),
  ordernumber int,
  description varchar(2000),
  paramstype varchar(50)
);
GO

-- 增加frame_log_level中defaultlevel --季晓伟
if not exists (select name from syscolumns  where id = object_id('frame_log_level') and name='defaultlevel' ) 
alter table frame_log_level add defaultlevel varchar(5);
GO 

-- 2017/12/27 
-- 施佳炜 
if not exists (select name from syscolumns  where id = object_id('api_info') and name='supportcontenttype' ) 
alter table api_info add supportcontenttype varchar(50);
else
alter table api_info
alter column supportcontenttype varchar(50);
GO

-- 施佳炜 
if not exists (select name from syscolumns  where id = object_id('api_info') and name='monitorurl' ) 
alter table api_info add monitorurl varchar(500); 
GO 

if not exists (select name from syscolumns  where id = object_id('api_info') and name='monitoruser' ) 
alter table api_info add monitoruser varchar(50); 
GO 

if not exists (select name from syscolumns  where id = object_id('api_info') and name='monitorpassword' ) 
alter table api_info add monitorpassword varchar(50); 
GO 

if not exists (select name from syscolumns  where id = object_id('api_runtime_log') and name='apiguid' ) 
alter table api_runtime_log add apiguid varchar(50); 
GO 

-- 2017/12/29
-- 增加系统参数脚本 --wy
if not exists(select configname from frame_config where configname = 'VisitLog')
begin 
insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber)Values('6915c092-ab9f-426c-9545-bee4125eb12e','VisitLog','0','设置是否需要记录访问日志，设置1为需要记录',null,null,'e01bbd72-c469-44e8-8165-217787156f5f',0);
end 
GO 

if not exists(select configname from frame_config where configname = 'SystemName')
begin 
insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values ('369658ac-8209-45c1-8837-c1cff2d57cea', 'SystemName', '新点应用集成平台', '系统名称', '349', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
end 
GO 

if not exists(select configname from frame_config where configname = 'LoginLogoImage')
begin 
 insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values ('6de6299a-8115-44b9-b2af-4acf9d6d2853', 'LoginLogoImage', 'frame/pages/login/images/login-title-zcpt.png', NULL, '0', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
end 
GO 

-- 附件信息是否加密-- 严璐琛
if not exists (select name from syscolumns  where id = object_id('frame_attachinfo') and name='isencrypt' ) 
alter table frame_attachinfo add  isencrypt integer; 
GO 

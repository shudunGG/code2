-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2017/5/27
-- frame_workingday增加一个字段 --施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_workingday') and column_name = upper('isfestival');
  if (isexist = 0) then
    execute immediate 'alter table frame_workingday add isfestival  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--2017/5/27
--frame_workingday增加一个字段 --施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_workingday') and column_name = upper('lunar');
  if (isexist = 0) then
    execute immediate 'alter table frame_workingday add lunar  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- 2017/5/27
-- 工作日相关 --何晓瑜
-- 节假日信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_festival');
 if (isexist = 0) then
    execute immediate '
      create table frame_festival 
       (rowguid           nvarchar2(50) not null primary key,
        festivalname      nvarchar2(50),
        starttime         date,
        endtime           date,
        takeoffday        nvarchar2(50),
        currentyear       integer
        )';
  end if;
  end;
end;
/* GO */

-- 2017/6/7
-- 新增可扩展控件属性表 --季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_control_property');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_control_property
(
  propertyguid   nvarchar2(50)  not null primary key,
  controlguid   nvarchar2(50),
  propertyname   nvarchar2(100),
  propertyenglishname  nvarchar2(50),
  allowfieldtype   nvarchar2(500),
  displaytype   nvarchar2(50),
  datasourcename  nvarchar2(500),
  initiatemode   nvarchar2(10),
  ordernum    number(10)
)
';
  end if;
  end;
end;
/* GO */

--新增可扩展控件表  --季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control');
 if (isexist = 0) then
    execute immediate '
 create table epointsform_extensible_control
(
  controlguid nvarchar2(50)  not null,
  controlname nvarchar2(100),
  controlenglishname  nvarchar2(50),
  allowfieldtype  nvarchar2(500),
  smallicon  nvarchar2(2000),
  largeicon  nvarchar2(2000),
  template    nvarchar2(500),
  initiatemode  nvarchar2(10),
  ordernum  number(10),
  defaultvalue nvarchar2(500)
)
';
  end if;
  end;
end;
/* GO */

-- 2017/6/7
-- frame_workingday和frame_festival各增加一个字段 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_workingday') and column_name = upper('isfestival');
  if (isexist = 0) then
    execute immediate 'alter table frame_workingday add isfestival  integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_festival') and column_name = upper('festivaltime');
  if (isexist = 0) then
    execute immediate 'alter table frame_festival add festivaltime  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 2017/6/13
-- 元件表新增字段--樊志君
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('rowspan');
  if (isexist = 0) then
    execute immediate 'alter table portal_item add rowspan  integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('colspan');
  if (isexist = 0) then
    execute immediate 'alter table portal_item add colspan  integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('url');
  if (isexist = 0) then
    execute immediate 'alter table portal_item add url  nvarchar2(500)';
  end if;
  end;
end;
/* GO */

--个人元件表新增字段--樊志君
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_myitem') and column_name = upper('rowspan');
  if (isexist = 0) then
    execute immediate 'alter table portal_myitem add rowspan integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_myitem') and column_name = upper('colspan');
  if (isexist = 0) then
    execute immediate 'alter table portal_myitem add colspan integer';
  end if;
  end;
end;
/* GO */

-- 2017/6/19
--  王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('belongportalguid');
  if (isexist = 0) then
    execute immediate 'alter table portal_item add  belongportalguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 首页元件视图修改--樊志君
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_portal_myitem');
 if (isexist = 0) then
    execute immediate '
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
where     (portal_item.disabled = 0)
';
  end if;
  end;
end;
/* GO */

-- 2017/6/30
-- 用户表（frame_user）添加updatepwd（修改密码时间）字段，并初始化数据--王露
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('updatepwd');
  if (isexist = 0) then
    execute immediate 'alter table frame_user add updatepwd date';
  end if;
  end;
end;
/* GO */
begin
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('updatepwd');
  if (isexist = 1) then
    execute immediate '
update frame_user set updatepwd =sysdate';
  end if;
  end;
end;
commit;
end;
/* GO */

-- 2017/7/6
-- 新增物理表api_class(服务类别) 施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_class');
 if (isexist = 0) then
    execute immediate '
create table  api_class
(
   belongxiaqucode nvarchar2(50) null,
   operateusername nvarchar2(50) null,
   operatedate date null,
   row_id integer null,
   yearflag nvarchar2(4) null,
   rowguid nvarchar2(50) not null primary key,
   apiclassguid nvarchar2(50) null,
   apiclassname nvarchar2(100) not null,
   apiclassremark nvarchar2(1000) null,
   ordernumber integer null,
   apiclassparentguid nvarchar2(100) null
)
';
  end if;
  end;
end;
/* GO */

-- 新增物理表api_scope(方法别名) 施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_scope');
 if (isexist = 0) then
    execute immediate '
create table api_scope
( 
   belongxiaqucode nvarchar2(50) null,
   operateusername nvarchar2(50) null,
   operatedate date null,
   row_id integer null,
   yearflag nvarchar2(4) null,
   rowguid nvarchar2(50) not null primary key,
   scopeguid nvarchar2(50) null,
   scopename nvarchar2(50) null,
   description nvarchar2(200) null,
   ordernum integer null,
   scopekey nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 新增物理表api_info(服务基本信息) 施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info');
 if (isexist = 0) then
    execute immediate '
create table api_info
( belongxiaqucode nvarchar2(50) null,
  operateusername nvarchar2(50) null,
  operatedate date null,
  row_id integer null,
  yearflag nvarchar2(4) null,
  rowguid nvarchar2(50) not null primary key,
  apiguid nvarchar2(50) null,
  apiname nvarchar2(200) null,
  categoryid nvarchar2(100) null,
  status nvarchar2(50) null,
  description nvarchar2(200) null,
  apirealurl nvarchar2(100) null, 
  urlpattern nvarchar2(500) null,
  userauth nvarchar2(50) null, 
  clientauth nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 新增物理表API_SCOPE_RELATION(方法scope关联表实体) 施佳炜 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_scope_relation');
 if (isexist = 0) then
    execute immediate '
create table api_scope_relation
( 
   belongxiaqucode nvarchar2(50) null,
  operateusername nvarchar2(50) null,
  operatedate date null,
  row_id integer null,
  yearflag nvarchar2(2) null,
  rowguid nvarchar2(50) not null constraint pk_api_scope_relation_rowguid primary key,
  apiguid nvarchar2(50) null,
  scopeguid nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 添加数据表api_log(api日志表)
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log');
 if (isexist = 0) then
    execute immediate '
create table api_runtime_log
( 
   belongxiaqucode nvarchar2(50) null,
   operateusername nvarchar2(50) null,
   operatedate date null,
   row_id integer null,
   yearflag nvarchar2(4) null,
   rowguid nvarchar2(50)  not null primary key,
   startat date null,
   method nvarchar2(50) null,
   requestsize number(18,2) null,
   consumer nvarchar2(50) null,
   clientip nvarchar2(50) null,
   responsesize number(18,2) null,
   status integer  null,
   forwardtime integer null,
   requesttime integer null,
   requesturl nvarchar2(500) null,
   context clob null,
   apiid nvarchar2(50) null,
   apiname nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 创建数据表API_SYNC_LOG
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_sync_log');
 if (isexist = 0) then
    execute immediate '
create table api_sync_log
( 
  belongxiaqucode nvarchar2(50) null,
   operateusername nvarchar2(50) null,
   operatedate date null,
   row_id number(10,0) null,
   yearflag nvarchar2(2) null,
   rowguid nvarchar2(50) not null constraint pk_api_sync_log_rowguid primary key,
   type nvarchar2(50) null,
   recorddate date null,
   status clob null,
   description nvarchar2(1000) null,
   clientid nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 2017/07/12
-- 施佳炜
-- 新增物理表FRAME_OU_E_SNAPSHOT(Frame_OU_E_SnapShot)
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_e_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_ou_e_snapshot
( 
   ouguid         nvarchar2(50) not null,
   isindependence number(10,0) null,
   oufax          nvarchar2(50) null,
   oucertguid     nvarchar2(50) null,
   oucertcontent  blob null,
   oucertname     nvarchar2(50) null,
   individuationimgpath clob null,
   appkey         nvarchar2(50) null,
   rowguid nvarchar2(50) not null,
   clientip nvarchar2(50) null,
   tenantguid nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-----------------wy

-- 创建数据表FRAME_OU_SNAPSHOT
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_ou_snapshot
( 
    ouguid      nvarchar2(50) not null,
    oucode      nvarchar2(50) null,
    ouname      nvarchar2(50) null,
    oushortname nvarchar2(50) null,
    ordernumber number(10,0) null,
    description nvarchar2(50) null,
    address     nvarchar2(50) null,
    postalcode  nvarchar2(50) null,
    tel         nvarchar2(50) null,
    baseouguid  nvarchar2(50) null,
    issubwebflow number(10,0) null,
    parentouguid nvarchar2(50) null,
    oucodelevel nvarchar2(500) null,
    haschildou number(10,0) null,
    haschilduser number(10,0) null,
    updatetime date null,
    testvarchar nvarchar2(50) null,
    testintger number(10,0) null,
    testnumber number(10,0) null,
    ordernumberfull nvarchar2(500) null,
    appkey nvarchar2(50) null,
    rowguid nvarchar2(50) not null,
    clientip nvarchar2(50) null,
    tenantguid nvarchar2(50) null,
    bussinessoucode nvarchar2(127) null,
    row_id number(10,0) null
)
';
  end if;
  end;
end;
/* GO */

-- 新增物理表FRAME_ROLE_SNAPSHOT(Frame_Role_SnapShot)
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_roletype_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_role_snapshot
( 
   roleguid nvarchar2(50) not null,
   rolename nvarchar2(50) null,
   ordernumber number(10,0) null,
   isreserved number(10,0) null,
   belongouguid nvarchar2(50) null,
   roletype nvarchar2(50) null,
   row_id number(10,0) null,
   isallowassign number(10,0) null,
   appkey nvarchar2(50) null,
   rowguid nvarchar2(50) not null,
   clientip nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */ 

-- 添加数据表FRAME_ROLETYPE_SNAPSHOT(Frame_RoleType_SnapShot)
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_roletype_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_roletype_snapshot
( 
   roletypeguid     nvarchar2(50) not null,
   roletypename     nvarchar2(50) null,
   ordernumber      number(10,0) null,
   belongbaseouguid nvarchar2(50) null,
   appkey           nvarchar2(50) null,
   rowguid          nvarchar2(50) not null,
   clientip         nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */ 
 
--新增物理表FRAME_SECONDOU_SNAPSHOT(Frame_SecondOU_SnapShot)
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_secondou_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_secondou_snapshot
( 
    row_id      number(10,0) not null,
    userguid    nvarchar2(50) not null,
    ouguid      nvarchar2(50) not null,
    title       nvarchar2(100) null,
    tel         nvarchar2(100) null,
    ordernumber number(20) null,
    user_ordernumber number(38) null,
    appkey           nvarchar2(50) null,
    clientip         nvarchar2(50) null,
    orderfloat       number(38) null,
    user_orderfloat  number(38) null,
    rowguid          nvarchar2(50) not null
)
';
  end if;
  end;
end;
/* GO */ 
 
-- 新增物理表Frame_User_E_SnapShot(Frame_User_E_SnapShot) 
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_e_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_user_e_snapshot
( 
   row_id number(10,0) null,
   userguid nvarchar2(50) not null,
   usbkey nvarchar2(50) null,
   birthday date null,
   qqnumber nvarchar2(50) null,
   msnnumber nvarchar2(50) null,
   piccontent blob null,
   piccontenttype nvarchar2(50) null,
   postaladdress nvarchar2(50) null,
   postalcode nvarchar2(50) null,
   identitycardnum nvarchar2(50) null,
   isdisable number(10,0) null,
   ntx_extnumber nvarchar2(50) null,
   ntx_password nvarchar2(50) null,
   epassrnd nvarchar2(50) null,
   epassserial nvarchar2(50) null,
   epassguid nvarchar2(50) null,
   epasspwd nvarchar2(50) null,
   ad_account nvarchar2(50) null,
   loginip clob null,
   shortmobile nvarchar2(50) null,
   appkey nvarchar2(50) null,
   rowguid nvarchar2(50) not null primary key,
   clientip nvarchar2(50) null,
   tenantguid nvarchar2(50) null,
   carnum nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */ 
 
-- 新增物理表FRAME_USERROLE_SNAPSHOT(Frame_UserRole_SnapShot)
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_userrole_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_userrole_snapshot
( 
   row_id number(10,0) not null,
   userguid nvarchar2(50) null,
   roleguid nvarchar2(50) null,
   updatetime date null,
   isfromsoa number(38,0) null,
   appkey nvarchar2(50) null,
   rowguid nvarchar2(50) not null constraint pk_frame_userrole_snapshot primary key,
   clientip nvarchar2(50) null,
   tenantguid nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */ 

--新增物理表FRAME_USER_SNAPSHOT(Frame_User_SnapShot)
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot');
 if (isexist = 0) then
    execute immediate '
create table frame_user_snapshot
( 
  userguid    nvarchar2(50) not null,
  loginid     nvarchar2(50) not null,
  password    nvarchar2(50) null,
  ouguid      nvarchar2(50) null,
  displayname nvarchar2(50) not null,
  isenabled   integer null,
  title       nvarchar2(50) null,
  leaderguid  nvarchar2(50) null,
  ordernumber integer null,
  telephoneoffice nvarchar2(50) null,
  mobile       nvarchar2(50) null,
  email        nvarchar2(50) null,
  description  nvarchar2(50) null,
  telephonehome  nvarchar2(50) null,
  fax          nvarchar2(50) null,
  allowuseemail number(10,0) null,
  sex          nvarchar2(50) null,
  oucodelevel  nvarchar2(500) null,
  updatetime date null,
  row_id number(10,0) null,
  firstname nvarchar2(50) null,
  middlename nvarchar2(50) null,
  lastname nvarchar2(50) null,
  prelang nvarchar2(50) null,
  timezone nvarchar2(50) null,
  adloginid nvarchar2(50) null,
  appkey nvarchar2(50) null,
  rowguid nvarchar2(50) not null,
  clientip nvarchar2(50) null,
  tenantguid nvarchar2(50) null,
  updatepwd date null
)
';
  end if;
  end;
end;
/* GO */ 

-- 2017/7/12
-- 新增应用类别表--何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_class');
 if (isexist = 0) then
    execute immediate '
create table app_class
( 
  appclassguid         nvarchar2(50) not null primary key,
  appclassname         nvarchar2(50),
  appclassremark       nvarchar2(200),
  ordernumber          nvarchar2(50),
  appclassparentguid   nvarchar2(50),
  appplat              nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增应用表--何晓瑜 
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info');
 if (isexist = 0) then
    execute immediate '
create table app_info
( 
 rowguid               nvarchar2(50) not null primary key,
  appkey                nvarchar2(50),
  appsecret             nvarchar2(50),
  appname               nvarchar2(100),
  callbackurl           nvarchar2(1000),
  approoturl            nvarchar2(1000),
  appconfigurl          nvarchar2(1000),
  apptype               nvarchar2(50),
  appstatus             nvarchar2(50),
  createdate            date,
  binddomain            nvarchar2(50),
  appentryname          nvarchar2(50),
  apprealurl            nvarchar2(1000),
  appclass              nvarchar2(50),
  appicon_b             nvarchar2(50),
  appicon_s             nvarchar2(50),
  metrocolspan          number(10,0),
  metrorowspan          number(10,0),
  metrobgcolor          nvarchar2(50),
  metroinnerurl         nvarchar2(500),
  metroisblank          nvarchar2(1),
  iosisblank            nvarchar2(1),
  metropageindex        integer,
  metrohowindex           number(10,0),
  scope                 nvarchar2(100),
  granttypes             nvarchar2(100),
  accesstokenvalidity   integer,
  refreshtokenvalidity  integer,
  archived              number(10,0),
  trusted               number(10,0),
  iosappwindowwidth     number(10,0),
  iosappwindowheight    number(10,0),
  metroappwindowwidth   number(10,0),
  metroappwindowheight  number(10,0),
  iospageindex          integer,
  iosshowindex          float,
  appdesc               nvarchar2(255),
  ssoindex              nvarchar2(50),
  ordernum              integer
)
';
  end if;
  end;
end;
/* GO */

--新增服务订阅表--何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe');
 if (isexist = 0) then
    execute immediate '
create table api_subscribe
( 
 rowguid             nvarchar2(50) not null primary key,
  apiguid             nvarchar2(50),
  appguid             nvarchar2(50),
  isenable            integer,
  refuse              nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增服务订阅视图 --何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_subscribed_api');
 if (isexist = 0) then
    execute immediate '
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
    on a.apiguid = b.rowguid
';
  end if;
  end;
end;
/* GO */ 

--新增方法授权视图 --何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_auth_api');
 if (isexist = 0) then
    execute immediate '
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
    on a.appguid = b.rowguid
';
  end if;
  end;
end;
/* GO */ 

--新增元件表 --何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_element');
 if (isexist = 0) then
    execute immediate '
create table app_element
( 
  rowguid                 nvarchar2(50) not null primary key,
  appguid                 nvarchar2(50),
  elementname             nvarchar2(50),
  elementurl              nvarchar2(50),
  elementdesc             nvarchar2(200),
  identityname            nvarchar2(50),
  ordernum                integer,
  positiontop             integer,
  positionleft            integer,
  width                   integer,
  height                  integer,
  linkapp                 nvarchar2(50),
  allowclosebutton        integer,
  appstatus               integer,
  isinit                  integer,
  userconfigurl             nvarchar2(50),
  thumbnail                 nvarchar2(50),
  picturebig                nvarchar2(50),
  desktopcreateappstoreicon nvarchar2(50),
  pageindex                integer
)
';
  end if;
  end;
end;
/* GO */ 

--新增元件授权表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_element_right');
 if (isexist = 0) then
    execute immediate '
create table app_element_right
( 
  rowguid             nvarchar2(50) not null primary key,
  allowtype           nvarchar2(50),
  allowto             nvarchar2(50),
  elementguid         nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增子应用表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module');
 if (isexist = 0) then
    execute immediate '
create table app_module
( 
moduleguid           nvarchar2(50)  not null primary key,
  appguid              nvarchar2(50),
  modulecode           nvarchar2(50),
  modulename           nvarchar2(50),
  modulemenuname       nvarchar2(50),
  ordernumber           integer,
  isdisable             integer,
  isblank               integer,
  bigiconaddress       nvarchar2(100),
  smalliconaddress     nvarchar2(100),
  appkey               nvarchar2(50),
  showinportal          integer,
  moduleurl            nvarchar2(500),
  needsync              integer,
  metrocolspan          integer,
  metrorowspan          integer,
  metrobgcolor         nvarchar2(50),
  metroinnerurl        nvarchar2(500),
  metroappwindowwidth  number(10,0),
  metroappwindowheight number(10,0),
  metroisblank         nvarchar2(1),
  iosisblank           nvarchar2(1),
  metropageindex        integer,
  metroshowindex        integer,
  iosappwindowwidth    number(10,0),
  iosappwindowheight   number(10,0),
  iospageindex          integer,
  iosshowindex          integer
)
';
  end if;
  end;
end;
/* GO */ 

--新增子应用授权表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module_right');
 if (isexist = 0) then
    execute immediate '
create table app_module_right
( 
  rowguid           nvarchar2(50)  not null primary key,
  moduleguid        nvarchar2(50),
  allowto           nvarchar2(50),
  allowtype         nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增应用授权表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_right');
 if (isexist = 0) then
    execute immediate '
create table app_right
( 
  rowguid    nvarchar2(50)  not null primary key,
  appguid    nvarchar2(50),
  allowto    nvarchar2(50),
  allowtype  nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增应用管理员表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_admin_relation');
 if (isexist = 0) then
    execute immediate '
create table app_admin_relation
( 
  rowguid           nvarchar2(50)  not null primary key,
  userguid            nvarchar2(50),
  appguid             nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增应用用户范围表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_user_relation');
 if (isexist = 0) then
    execute immediate '
create table app_user_relation
( 
  rowguid           nvarchar2(50)  not null primary key,
  allowtype           nvarchar2(50),
  allowto             nvarchar2(50),
  appguid             nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增应用角色授权表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_role_relation');
 if (isexist = 0) then
    execute immediate '
create table app_role_relation
( 
  rowguid           nvarchar2(50)  not null primary key,
  roleguid            nvarchar2(50),
  appguid             nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 2017/07/15
-- 新增app_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('app_id');
  if (isexist = 0) then
    execute immediate 'alter table app_info add app_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增counsumer_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('consumer_id');
  if (isexist = 0) then
    execute immediate 'alter table app_info add consumer_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增username--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('username');
  if (isexist = 0) then
    execute immediate 'alter table app_info add username nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增api_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('api_id');
  if (isexist = 0) then
    execute immediate 'alter table api_info add api_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增provisionkey--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('provisionkey');
  if (isexist = 0) then
    execute immediate 'alter table api_info add provisionkey nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增oauth_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('oauth_id');
  if (isexist = 0) then
    execute immediate 'alter table api_info add oauth_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增acl_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('acl_id');
  if (isexist = 0) then
    execute immediate 'alter table api_info add acl_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增api调用地址--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('api_url');
  if (isexist = 0) then
    execute immediate 'alter table api_info add api_url nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增api名称编码--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('apiencodename');
  if (isexist = 0) then
    execute immediate 'alter table api_info add apiencodename nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增api_subscribe_id--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('acl_subscribe_id');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add acl_subscribe_id nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增空同步状态
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('syncflag');
  if (isexist = 0) then
    execute immediate 'alter table api_info add syncflag nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增空同步状态
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('syncflag');
  if (isexist = 0) then
    execute immediate 'alter table app_info add syncflag nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增空同步异常信息
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('syncexception');
  if (isexist = 0) then
    execute immediate 'alter table api_info add syncexception nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

--新增空同步异常信息
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('syncexception');
  if (isexist = 0) then
    execute immediate 'alter table app_info add syncexception nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

--新增日志id字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('log_id');
  if (isexist = 0) then
    execute immediate 'alter table api_info add  log_id  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 2017/7/17
-- 可扩展控件表新增移动模板、控件class、扩展控件一、扩展控件二四个字段---季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control') and column_name = upper('mobiletemplate');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_extensible_control add mobiletemplate  nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control') and column_name = upper('controlclass');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_extensible_control add controlclass  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control') and column_name = upper('extendfieldone');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_extensible_control add extendfieldone  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control') and column_name = upper('extendfieldtwo');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_extensible_control add extendfieldtwo  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

--新增同步标志位表--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_syncflag');
 if (isexist = 0) then
    execute immediate '
create table app_syncflag
( 
  appkey         nvarchar2(50) not null primary key,
  orglastupdguid nvarchar2(50) not null
)
';
  end if;
  end;
end;
/* GO */ 

-- 新增界面ui相关表--樊志君
-- 界面风格表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui');
 if (isexist = 0) then
    execute immediate '
create table frame_ui
( 
  rowguid             nvarchar2(50) not null primary key,
  uiname              nvarchar2(50),
  pageid              nvarchar2(50),
  themetype           nvarchar2(50),
  themeurl            nvarchar2(500),
  mainprotalguid      nvarchar2(50),
  mainpageurl         nvarchar2(500),
  fullsearchurl       nvarchar2(500),
  ordernumber         integer,
  title               nvarchar2(50),
  logoimage           blob,
  logocontenttype     nvarchar2(50),
  logoimageudpatetime date,
  previewimage        blob,
  previewcontenttype  nvarchar2(50),
  isenableexun        integer,
  isdisable           integer
)
';
  end if;
  end;
end;
/* GO */ 

-- 界面风格权限表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui_right');
 if (isexist = 0) then
    execute immediate '
create table frame_ui_right
( 
  rowguid   nvarchar2(50) not null primary key,
  uiguid    nvarchar2(50),
  allowto   nvarchar2(50),
  allowtype nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 界面方案与模块关系表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui_module');
 if (isexist = 0) then
    execute immediate '
create table frame_ui_module
( 
  rowguid   nvarchar2(50) not null primary key,
  belonguiguid nvarchar2(50),
  modulecode   nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 桌面表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_desk');
 if (isexist = 0) then
    execute immediate '
create table frame_desk
( 
  rowguid   nvarchar2(50) not null primary key,
  deskname          nvarchar2(50),
  belonguiguid      nvarchar2(50),
  desknumber        integer,
  metroappinonesize nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 框架标准应用表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_app');
 if (isexist = 0) then
    execute immediate '
create table frame_app
( 
  rowguid   nvarchar2(50) not null primary key,
  appname         nvarchar2(50),
  moduleguid      nvarchar2(50),
  belongdeskguid  nvarchar2(50),
  ordernumber     integer,
  imacicon        nvarchar2(50),
  applocation     nvarchar2(50),
  backgroudcolor  nvarchar2(50),
  metroicon       nvarchar2(50),
  messagecounturl nvarchar2(500)
)
';
  end if;
  end;
end;
/* GO */ 

-- 框架标准个人应用表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_personapp');
 if (isexist = 0) then
    execute immediate '
create table frame_personapp
( 
  rowguid   nvarchar2(50) not null primary key,
  appguid        nvarchar2(50),
  belonguserguid nvarchar2(50),
  belongdeskguid nvarchar2(50),
  ordernumber    integer
)
';
  end if;
  end;
end;
/* GO */ 

-- 门户表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal');
 if (isexist = 0) then
    execute immediate '
create table frame_portal
( 
  rowguid   nvarchar2(50) not null primary key,
  portalname  nvarchar2(50),
  ordernumber integer,
  isdisable   integer,
  portaltype  integer,
  portalurl   nvarchar2(1000)
)
';
  end if;
  end;
end;
/* GO */ 

-- 门户权限表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portalright');
 if (isexist = 0) then
    execute immediate '
create table frame_portalright
( 
  rowguid   nvarchar2(50) not null primary key,
  portalguid nvarchar2(50),
  allowto    nvarchar2(50),
  allowtype  nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 首页元件新增字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('belongportalguid');
  if (isexist = 0) then
    execute immediate ' alter table portal_item add  belongportalguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('portal_item') and column_name = upper('extrainfo');
  if (isexist = 0) then
    execute immediate 'alter table portal_item add extrainfo nclob';
  end if;
  end;
end;
/* GO */

-- 子应用表增加字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('belongdeskguid');
  if (isexist = 0) then
    execute immediate 'alter table app_module add belongdeskguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('icon');
  if (isexist = 0) then
    execute immediate 'alter table app_module add icon nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('iconcontent');
  if (isexist = 0) then
    execute immediate 'alter table app_module add iconcontent blob';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('iconcontenttype');
  if (isexist = 0) then
    execute immediate 'alter table app_module add iconcontenttype nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('iconupdatetime');
  if (isexist = 0) then
    execute immediate 'alter table app_module add iconupdatetime date';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('messagecounturl');
  if (isexist = 0) then
    execute immediate 'alter table app_module add messagecounturl nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- 个人应用表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_personalmodule');
 if (isexist = 0) then
    execute immediate '
create table app_personalmodule
( 
  rowguid   nvarchar2(50) not null primary key,
  moduleguid     nvarchar2(50),
  belonguserguid nvarchar2(50),
  belongdeskguid nvarchar2(50),
  ordernumber    integer,
  isdisable      integer
)
';
  end if;
  end;
end;
/* GO */ 

-- 应用元件表新增字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_element') and column_name = upper('isdisable');
  if (isexist = 0) then
    execute immediate 'alter table app_element add  isdisable integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_element') and column_name = upper('extrainfo');
  if (isexist = 0) then
    execute immediate 'alter table app_element add  extrainfo nclob';
  end if;
  end;
end;
/* GO */

-- 门户元件对应关系表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_portal_element');
 if (isexist = 0) then
    execute immediate '
create table app_portal_element
( 
  rowguid   nvarchar2(50) not null primary key,
  elementguid      nvarchar2(50),
  belongportalguid nvarchar2(50),
  elementlocation  nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

-- 2017/7/19
-- 新建个人应用视图--樊志君
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_app_mymodule');
 if (isexist = 0) then
    execute immediate '
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
  m.isdisable = 0
';
  end if;
  end;
end;
/* GO */

-- 2017/7/24
-- 工作平台应用与类别视图--樊志君
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_app_infoclass');
 if (isexist = 0) then
    execute immediate '
create  view view_app_infoclass as
select
  a.rowguid,
  a.appname,
  b.appclassguid,
  b.appclassname,
  a.ordernum,
  b.ordernumber
from app_info a
left join   app_class b on  a.appclass = b.appclassguid
where 
  m.isdisable = 0
';
  end if;
  end;
end;
/* GO */

-- 2017/7/26
-- 工作平台界面增加字段--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui') and column_name = upper('previewupdatetime');
  if (isexist = 0) then
    execute immediate 'alter table frame_ui add previewupdatetime date';
  end if;
  end;
end;
/* GO */

-- 2017/7/27
-- 新增个人元件门户关系表--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('personal_portal_element');
 if (isexist = 0) then
    execute immediate '
create table personal_portal_element
( 
  ptrowguid        nvarchar2(50) not null primary key,
  isdisable        integer,
  userguid         nvarchar2(50),
  elementlocation  nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */ 

--新增个人元件门户视图--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_personal_element');
 if (isexist = 0) then
    execute immediate '
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
  join app_element b on c.elementguid=b.rowguid
';
  end if;
  end;
end;
/* GO */

-- 2017/7/31
-- 首页元件视图修改--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_portal_myitem');
 if (isexist = 0) then
    execute immediate '
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
where     (portal_item.disabled = 0)
';
  end if;
  end;
end;
/* GO */

-- 2017/8/2
-- 子应用表 -- 何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('heightratio');
  if (isexist = 0) then
    execute immediate 'alter table app_module add heightratio number(10)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('widthratio');
  if (isexist = 0) then
    execute immediate 'alter table app_module add widthratio number(10)';
  end if;
  end;
end;
/* GO */

-- 2017/8/3
-- 表单设计器相关表添加备用字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointform_version') and column_name = upper('updatetime');
  if (isexist = 0) then
    execute immediate 'alter table epointform_version add  updatetime  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointform_version') and column_name = upper('bak1');
  if (isexist = 0) then
    execute immediate 'alter table epointform_version add  bak1  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointform_version') and column_name = upper('bak2');
  if (isexist = 0) then
    execute immediate 'alter table epointform_version add  bak2  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_control_property') and column_name = upper('bak1');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_control_property  add  bak1  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_control_property') and column_name = upper('bak2');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_control_property  add  bak2  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

--表分类信息  ---季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_category');
 if (isexist = 0) then
    execute immediate '
create table epointsform_table_category
(
  categoryid   number(10)  not null primary key,
  categorynum   nvarchar2(100),
  categoryname  nvarchar2(100),
  ordernum   number(10),   
  homepageurl  nclob,
  categoryguid  nvarchar2(100),
  parentcategoryguid  nvarchar2(100),
  bak1  nvarchar2(100),
  bak2  nvarchar2(100),
  appguid nvarchar2(100)
)
';
  end if;
  end;
end;
/* GO */ 

--表基本信息  ---季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_basicinfo');
 if (isexist = 0) then
    execute immediate '
create table epointsform_table_basicinfo
(
  tableid   number(10)  not null primary key,
  tableguid   nvarchar2(100)  not null,
  tablename  nvarchar2(100)  not null,
  sql_tablename   nvarchar2(100),   
  tabletype  number(10)  not null,
  parenttableid  number(10),
  categorynum  nvarchar2(100),
  ordernum  number(10),
  usepagetype  nvarchar2(100),
  leaderviewurl  nvarchar2(100),
  designclass  nvarchar2(100),
  bak1  nclob,
  bak2  nvarchar2(100),
  bak3  nvarchar2(100),
  appguid nvarchar2(100)
)
';
  end if;
  end;
end;
/* GO */

--表结构信息  ---季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct');
 if (isexist = 0) then
    execute immediate '
create table epointsform_table_struct
(
  fieldid   number(10)  not null  primary key,
  fieldname   nvarchar2(100),
  fieldtype  nvarchar2(100),
  fieldlength   number(10),   
  fieldchinesename  nvarchar2(100),
  todispingrid  number(10),
  isforeignkey  nvarchar2(2),
  ordernumingrid  number(10),
  fielddefaultvalue  nvarchar2(100),
  notnull  number(10),
  isquerycondition  number(10),
  mustfill  number(10),
  datasource  nclob,
  datasource_codename  nvarchar2(100),
  orderdirection  nvarchar2(100),
  isorderfield  number(10),
  uniquefield  number(10),
  fieldindex  number(10),
  tableid  number(10),
  controlwidth  number(10),
  defaultvalue  nvarchar2(100),
  fieldjd  number(10),
  gridwidth  number(10),
  gridmultirows  number(10),
  dispfielddesc  number(10),
  initgetvaluesql  nclob,
  isexportexcel  number(10),
  dispinadd  number(10),
  fieldnamebasictable  nvarchar2(300),
  fielddisplaytype  nvarchar2(500),
  fieldnameParenttable  nvarchar2(300),
  validcheckformula  nvarchar2(300),
  valueurl  nvarchar2(1024),
  basicfieldname  nvarchar2(255),
  fielddesc  nvarchar2(500),
  bak1  nclob,
  bak2  nvarchar2(100),
  bak3  nvarchar2(100)
)
';
  end if;
  end;
end;
/* GO */ 

-- 2017/8/6
-- 用户为应用授权表  ---施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('user_app_scope');
 if (isexist = 0) then
    execute immediate '
create table user_app_scope
(
  belongxiaqucode  nvarchar2(50)  null,
  operateusername nvarchar2(50) null,
  operatedate date null,
  row_id number(10,0) null,
  yearflag nvarchar2(4) null,
  rowguid nvarchar2(50)  not null primary key,
  loginid nvarchar2(50) null,
  appguid nvarchar2(50) null,
  scopeguid nvarchar2(50) null
)
';
  end if;
  end;
end;
/* GO */

-- 2017/8/10
-- 更改字段长度-- 施佳炜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('apiencodename');
  if (isexist = 1) then
    execute immediate 'alter table api_info modify apiencodename nvarchar2(500)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('api_url');
  if (isexist = 1) then
    execute immediate 'alter table api_info modify api_url nvarchar2(500)';
  end if;
  end;
end;
/* GO */


-- 2017/8/29
-- 个人应用表增加uiguid关联字段 --樊志君
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_personalmodule') and column_name = upper('uiguid');
  if (isexist = 0) then
    execute immediate 'alter table app_personalmodule add  uiguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 个人应用视图修改
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_views where view_name = upper('view_app_mymodule');
 if (isexist = 0) then
    execute immediate '
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
  m.isdisable = 0
';
  end if;
  end;
end;
/* GO */


-- 2017/8/30
-- 消息表clientIdentifier字段改为2000长度 --何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('clientIdentifier');
  if (isexist = 1) then
    execute immediate 'alter table messages_message modify clientIdentifier nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- 2017/9/1
-- apiinfo表添加提交、返回示例字段 --包永廉
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('requestsample');
  if (isexist = 0) then
    execute immediate 'alter table api_info add  requestsample  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('responsesample');
  if (isexist = 0) then
    execute immediate 'alter table api_info add  responsesample  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- 2017/9/5
-- 新增ios证书表 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_ios_certification');
 if (isexist = 0) then
    execute immediate '
create table messages_ios_certification
(
  rowguid              nvarchar2(50) not null primary key,
  iosappguid           nvarchar2(50),
  password             nvarchar2(50),
  filename             nvarchar2(50),
  path                 nvarchar2(100),
  type                 nvarchar2(10),
  uploadtime           date,
  cercontent           blob,
  contenttype          nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */


-- 2017/9/7
-- messages_channel表增加字段 --何晓瑜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_channel') and column_name = upper('userchannelimplclass');
  if (isexist = 0) then
    execute immediate 'alter table messages_channel add userchannelimplclass nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 2017/9/13
-- 工作流工作项表添加senderWorkItemGuid字段记录来源工作项guid--季晓伟
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_workitem') and column_name = upper('senderworkitemguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_workitem add senderworkitemguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_workitem_history') and column_name = upper('senderworkitemguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_workitem_history add senderworkitemguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 2017/9/28
-- 表单版本表添加js，css存储字段---季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointform_version') and column_name = upper('jscontent');
  if (isexist = 0) then
    execute immediate 'alter table epointform_version add jscontent nclob';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointform_version') and column_name = upper('csscontent');
  if (isexist = 0) then
    execute immediate 'alter table epointform_version add csscontent nclob';
  end if;
  end;
end;
/* GO */

-- 2017/11/8
-- 新增登录访问日志表--周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_login_log');
 if (isexist = 0) then
    execute immediate '
create table  frame_login_log
(
  rowguid nvarchar2(50) not null primary key,
  userguid nvarchar2(50),
  loginid nvarchar2(50),
  clientip nvarchar2(50),
  errordescription nvarchar2(1000),
  accesstime date,
  loginstate nvarchar2(50) 
)
';
  end if;
  end;
end;
/* GO */

--新增禁用IP记录表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ip_lockinfo');
 if (isexist = 0) then
    execute immediate '
create table  frame_ip_lockinfo
(
  rowguid nvarchar2(50) not null primary key,
  clientip nvarchar2(50),
  iptype nvarchar2(50),
  ipmanagertype nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */

-- 2017/11/10
-- 统一消息移动端对接 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_rule') and column_name = upper('pcurltemplate');
  if (isexist = 0) then
    execute immediate 'alter table messages_rule add pcurltemplate nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_rule') and column_name = upper('mobileurltemplate');
  if (isexist = 0) then
    execute immediate 'alter table messages_rule add mobileurltemplate nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_rule') and column_name = upper('mobileitem');
  if (isexist = 0) then
    execute immediate 'alter table messages_rule add mobileitem nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- 2017/11/14
-- 统一消息移动端对接 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('clientIdentifier4');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add  clientIdentifier4 nvarchar2(200)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('clientIdentifier5');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add clientIdentifier5 nvarchar2(200)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('clientIdentifier6');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add clientIdentifier6 nvarchar2(200)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('isnoneedremind');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add isnoneedremind integer';
  end if;
  end;
end;
/* GO */

-- 2017/11/22
-- 用户角色关系快照表加一个字段--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_userrole_snapshot') and column_name = upper('userroleguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_userrole_snapshot add userroleguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- 2017/12/7
-- 移动端设置消息是否置顶 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_mobile_config');
 if (isexist = 0) then
    execute immediate '
create table  messages_mobile_config
(
  rowguid              nvarchar2(50) not null primary key,
  userid               nvarchar2(50),
  typeguid             nvarchar2(50),
  istop                integer
)
';
  end if;
  end;
end;
/* GO */

-- 2017/12/21
-- 统一应用表增加字段移动页面部署地址 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('mobilepageurl');
  if (isexist = 0) then
    execute immediate 'alter table app_info add mobilepageurl nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 2017/12/22
-- 去除TABLE_BASICINFO表上面的触发器，程序已经处理无需触发器
-- 而且触发器编写有问题会导致tableid无法自定义      --盛佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_triggers where trigger_name = upper('tg_table_basicinfo_row_id'); 
  if (isexist = 1) then
    execute immediate 'drop trigger tg_table_basicinfo_row_id';  
  end if;
  end;
end;
/* GO */

-- 2017/12/25
-- 新增服务配置表 --周志豪 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_config');
 if (isexist = 0) then
    execute immediate '
create table  api_config
(
  rowguid       nvarchar2(50) not null primary key,
  configname    nvarchar2(50), 
  configvalue   clob, 
  description   clob 
)
';
  end if;
  end;
end;
/* GO */


--同步日志表增加字段target 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_sync_log') and column_name = upper('target');
  if (isexist = 0) then
    execute immediate 'alter table api_sync_log add target integer';
  end if;
  end;
end;
/* GO */

--服务基本信息表增加字段 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('type');
  if (isexist = 0) then
    execute immediate 'alter table api_info add type nvarchar2(2)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('method');
  if (isexist = 0) then
    execute immediate 'alter table api_info add method nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('supportcontenttype');
  if (isexist = 0) then
    execute immediate 'alter table api_info add supportcontenttype nvarchar2(2)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('attention');
  if (isexist = 0) then
    execute immediate 'alter table api_info add attention nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('retries');
  if (isexist = 0) then
    execute immediate 'alter table api_info add retries integer';
  end if;
  end;
end;
/* GO */
 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('upstreamconnecttimeout');
  if (isexist = 0) then
    execute immediate 'alter table api_info add upstreamconnecttimeout integer';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('upstreamsendtimeout');
  if (isexist = 0) then
    execute immediate 'alter table api_info add upstreamsendtimeout integer';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('upstreamreadtimeout');
  if (isexist = 0) then
    execute immediate 'alter table api_info add upstreamreadtimeout integer';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('httpsonly');
  if (isexist = 0) then
    execute immediate 'alter table api_info add httpsonly nvarchar2(50)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('httpifterminated');
  if (isexist = 0) then
    execute immediate 'alter table api_info add httpifterminated nvarchar2(50)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('stripuri');
  if (isexist = 0) then
    execute immediate 'alter table api_info add stripuri nvarchar2(50)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('preservehost');
  if (isexist = 0) then
    execute immediate 'alter table api_info add preservehost nvarchar2(50)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('createdate');
  if (isexist = 0) then
    execute immediate 'alter table api_info add createdate date';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('updatedate');
  if (isexist = 0) then
    execute immediate 'alter table api_info add updatedate date';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('runstate');
  if (isexist = 0) then
    execute immediate 'alter table api_info add runstate nvarchar2(50)';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('plugininfo');
  if (isexist = 0) then
    execute immediate 'alter table api_info add plugininfo clob';
  end if;
  end;
end;
/* GO */

--新增请求参数表 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_request_params');
 if (isexist = 0) then
    execute immediate '
create table  api_request_params
(
  rowguid       nvarchar2(50) not null primary key,
  apiguid nvarchar2(50),
  name nvarchar2(100),
  type nvarchar2(50),
  ismust nvarchar2(2),
  ordernumber integer,
  description nvarchar2(2000),
  paramstype nvarchar2(50)
)
';
  end if;
  end;
end;
/* GO */

-- 增加frame_log_level中defaultlevel --季晓伟
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log_level') and column_name = upper('defaultlevel');
  if (isexist = 0) then
    execute immediate 'alter table frame_log_level add defaultlevel nvarchar2(5)';
  end if;
  end;
end;
/* GO */

-- 2017/12/27 
-- 周志豪
-- 修改错误触发器
begin
 execute immediate '
    CREATE OR REPLACE TRIGGER "TG_FRAME_COMMISSIONSET_HANDLE" 
BEFORE INSERT ON FRAME_COMMISSIONSET_HANDLE
FOR EACH ROW
 
BEGIN
SELECT SQ_FRAME_COMMISSIONSET_HANDLE.NEXTVAL INTO :NEW.ROW_ID FROM DUAL;
end;
';  
end;
/* GO */

-- 施佳炜 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log') and column_name = upper('supportcontenttype');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_log modify supportcontenttype nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 施佳炜 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('monitorurl');
  if (isexist = 0) then
    execute immediate 'alter table api_info add monitorurl nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('monitoruser');
  if (isexist = 0) then
    execute immediate 'alter table api_info add monitoruser nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('monitorpassword');
  if (isexist = 0) then
    execute immediate 'alter table api_info add monitorpassword nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log') and column_name = upper('apiguid');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_log add apiguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 2017/12/29
-- 增加系统参数脚本 --wy
begin
begin
declare isexist number;
begin
select count(*) into isexist from frame_config frame_config where configname = 'VisitLog';
if (IsExist=0) then
/*添加代码：(VisitLog)*/
insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values
('6915c092-ab9f-426c-9545-bee4125eb12e','VisitLog','0','设置是否需要记录访问日志，设置1为需要记录',null,null,'e01bbd72-c469-44e8-8165-217787156f5f',0);
 end if;
  end;
end;
commit;
end;
/* GO */

begin
begin
declare isexist number;
begin
select count(*) into isexist from frame_config frame_config where configname = 'SystemName';
if (IsExist=0) then
/*添加代码：(SystemName)*/
insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values 
('369658ac-8209-45c1-8837-c1cff2d57cea', 'SystemName', '新点应用集成平台', '系统名称', '349', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
 end if;
  end;
end;
commit;
end;
/* GO */

begin
begin
declare isexist number;
begin
select count(*) into isexist from frame_config frame_config where configname = 'LoginLogoImage';
if (IsExist=0) then
/*添加代码：(LoginLogoImage)*/
  insert into frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) values 
  ('6de6299a-8115-44b9-b2af-4acf9d6d2853', 'LoginLogoImage', 'frame/pages/login/images/login-title-zcpt.png', NULL, '0', NULL, 'e01bbd72-c469-44e8-8165-217787156f5f', '0');
 end if;
  end;
end;
commit;
end;
/* GO */


-- 附件信息是否加密-- 严璐琛
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('isencrypt');
  if (isexist = 0) then
    execute immediate 'alter table frame_attachinfo add  isencrypt integer';
  end if;
  end;
end;
/* GO */
-- end;



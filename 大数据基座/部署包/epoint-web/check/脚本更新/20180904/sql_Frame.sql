-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/04 【时间】
-- 门户、元件 表等同步9.2.9相关功能，字段添加--季立霞

-- 添加门户相关字段
-- 添加布局模版guid字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='layouttempguid' ) 
alter table frame_portal add layouttempguid  varchar(2000); 
GO

-- 添加所属类别字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='typeguid' ) 
alter table frame_portal add typeguid  varchar(50); 
GO

-- 添加描述字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='description' ) 
alter table frame_portal add description  varchar(200); 
GO

-- 添加创建用户guid字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='userguid' ) 
alter table frame_portal add userguid  varchar(50); 
GO

-- 添加创建部门guid字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='ouguid' ) 
alter table frame_portal add ouguid  varchar(50); 
GO

-- 添加创建独立管理部门guid字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='baseouguid' ) 
alter table frame_portal add baseouguid  varchar(50); 
GO

-- 添加默认展示字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='defaultdisplay' ) 
alter table frame_portal add defaultdisplay  int; 
GO

-- 添加门户权限相关字段
-- 添加righttype字段
if not exists (select name from syscolumns  where id = object_id('frame_portalright') and name='righttype' ) 
alter table frame_portalright add righttype  varchar(50); 
GO

-- 新增门户类别表 
if not exists (select * from dbo.sysobjects where id = object_id('frame_portaltype'))
create table frame_portaltype
(   
   rowguid     varchar(50) not null primary key,
   typename    varchar(50),
   ordernumber int
);
GO

-- 新增门户元件表
if not exists (select * from dbo.sysobjects where id = object_id('frame_portal_element'))
create table frame_portal_element
(
   rowguid                varchar(50) not null primary key,
   belongportalguid       varchar(50),
   rowindex               int,
   colindex               int,
   belongelementtempguid  varchar(50),
   title                  varchar(50),
   icon                   varchar(200),
   fontcolor              varchar(50),
   backgroundcolor        varchar(50),
   titlebackgroundcolor   varchar(50),
   customlinkurl          varchar(200),
   infocount              int,
   titlelength            int,
   openwith               varchar(50),
   isshowtitle            int,
   isshowmorebutton       int,
   isshowrefresh          int,
   moreopenwith           varchar(50),
   framecolor             varchar(50),
   height                 int,
   extendcustomattr       varchar(1000),
   belonglayoutguid       varchar(50)
);
GO

-- 新增元件模板表
if not exists (select * from dbo.sysobjects where id = object_id('frame_component_template'))
create table frame_component_template (
  rowguid varchar(50) not null primary key,
  componentname varchar(50),
  componenttype varchar(50),
  ordernumber int,
  mangeurl varchar(200),
  showurl varchar(200),
  showicon varchar(200),
  templateheight int,
  moreurl varchar(200),
  moreopenwith varchar(50),
  customtitleheight  int,
  appguid varchar(50)
);
GO

-- 新增布局模板表
if not exists (select * from dbo.sysobjects where id = object_id('frame_layout_template'))
create table frame_layout_template(
  rowguid varchar(50) not null primary key,
  templatename varchar(50),
  ordernumber int,
  customwidth varchar(100),
  thumbnail varchar(200)
);
GO

-- 添加拓展配置表 
if not exists (select * from dbo.sysobjects where id = object_id('frame_exttabsconfig'))
create table frame_exttabsconfig
   (
    rowguid     varchar(50) not null primary key,
    extname     varchar(50),
    exturl      varchar(50),
    opentype    varchar(50),
    exticon     varchar(50),
    exttype     int
    );
GO

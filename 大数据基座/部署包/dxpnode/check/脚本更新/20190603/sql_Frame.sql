-- 所有脚本可直接复制到sql server查询设计器中执行
if not exists (select * from dbo.sysobjects where id = object_id('frame_portaltype'))
create table frame_portaltype
   (
    rowguid varchar(50) NOT NULL primary key,
    typename varchar(50) DEFAULT NULL,
    ordernumber int DEFAULT NULL
    );
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_portal_element'))
create table frame_portal_element
   (
   rowguid varchar(50) NOT NULL primary key,
  belongportalguid varchar(50) DEFAULT NULL,
  rowindex int DEFAULT NULL,
  colindex int DEFAULT NULL,
  belongelementtempguid varchar(50) DEFAULT NULL,
  title varchar(50) DEFAULT NULL,
  icon varchar(200) DEFAULT NULL,
  fontcolor varchar(50) DEFAULT NULL,
  backgroundcolor varchar(50) DEFAULT NULL,
  titlebackgroundcolor varchar(50) DEFAULT NULL,
  customlinkurl varchar(200) DEFAULT NULL,
  infocount int DEFAULT NULL,
  titlelength int DEFAULT NULL,
  openwith varchar(50) DEFAULT NULL,
  isshowtitle int DEFAULT NULL,
  isshowmorebutton int DEFAULT NULL,
  isshowrefresh int DEFAULT NULL,
  moreopenwith varchar(50) DEFAULT NULL,
  framecolor varchar(50) DEFAULT NULL,
  height int DEFAULT NULL,
  extendcustomattr varchar(1000) DEFAULT NULL,
  belonglayoutguid varchar(50) DEFAULT NULL
    );
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_component_template'))
create table frame_component_template
   (
    rowguid varchar(50) NOT NULL  PRIMARY KEY,
  componentname varchar(50) DEFAULT NULL,
  componenttype varchar(50) DEFAULT NULL,
  ordernumber int DEFAULT NULL,
  mangeurl varchar(200) DEFAULT NULL,
  showurl varchar(200) DEFAULT NULL,
  showicon varchar(200) DEFAULT NULL,
  templateheight int DEFAULT NULL,
  moreurl varchar(200) DEFAULT NULL,
  moreopenwith varchar(50) DEFAULT NULL,
  customtitleheight int DEFAULT NULL,
  appguid varchar(50) DEFAULT NULL
    );
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_layout_template'))
create table frame_layout_template
   (
 rowguid varchar(50) NOT NULL  PRIMARY KEY,
  templatename varchar(50) DEFAULT NULL,
  ordernumber int DEFAULT NULL,
  customwidth varchar(100) DEFAULT NULL,
  thumbnail varchar(200) DEFAULT NULL
    );
GO


if not exists (select * from dbo.sysobjects where id = object_id('frame_accountrelation'))
create table frame_accountrelation
   (
 rowguid varchar(50) NOT NULL  PRIMARY KEY,
  templatename varchar(50) DEFAULT NULL,
  ordernumber int DEFAULT NULL,
   userguid  varchar(50) NULL,
   relativeuserguid   varchar(50)  NULL
    );
GO
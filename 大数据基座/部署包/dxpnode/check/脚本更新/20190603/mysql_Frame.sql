-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/16
CREATE TABLE if not exists frame_portaltype (
  rowguid varchar(50) NOT NULL primary key,
  typename varchar(50) DEFAULT NULL,
  ordernumber int(11) DEFAULT NULL
);
GO


CREATE TABLE if not exists frame_portal_element (
  rowguid varchar(50) NOT NULL primary key,
  belongportalguid varchar(50) DEFAULT NULL,
  rowindex int(11) DEFAULT NULL,
  colindex int(11) DEFAULT NULL,
  belongelementtempguid varchar(50) DEFAULT NULL,
  title varchar(50) DEFAULT NULL,
  icon varchar(200) DEFAULT NULL,
  fontcolor varchar(50) DEFAULT NULL,
  backgroundcolor varchar(50) DEFAULT NULL,
  titlebackgroundcolor varchar(50) DEFAULT NULL,
  customlinkurl varchar(200) DEFAULT NULL,
  infocount int(11) DEFAULT NULL,
  titlelength int(11) DEFAULT NULL,
  openwith varchar(50) DEFAULT NULL,
  isshowtitle int(11) DEFAULT NULL,
  isshowmorebutton int(11) DEFAULT NULL,
  isshowrefresh int(11) DEFAULT NULL,
  moreopenwith varchar(50) DEFAULT NULL,
  framecolor varchar(50) DEFAULT NULL,
  height int(11) DEFAULT NULL,
  extendcustomattr varchar(1000) DEFAULT NULL,
  belonglayoutguid varchar(50) DEFAULT NULL
);
GO

CREATE TABLE if not exists frame_component_template (
  rowguid varchar(50) NOT NULL  PRIMARY KEY,
  componentname varchar(50) DEFAULT NULL,
  componenttype varchar(50) DEFAULT NULL,
  ordernumber int(11) DEFAULT NULL,
  mangeurl varchar(200) DEFAULT NULL,
  showurl varchar(200) DEFAULT NULL,
  showicon varchar(200) DEFAULT NULL,
  templateheight int(11) DEFAULT NULL,
  moreurl varchar(200) DEFAULT NULL,
  moreopenwith varchar(50) DEFAULT NULL,
  customtitleheight int(11) DEFAULT NULL,
  appguid varchar(50) DEFAULT NULL
);
GO

CREATE TABLE if not exists frame_layout_template (
  rowguid varchar(50) NOT NULL  PRIMARY KEY,
  templatename varchar(50) DEFAULT NULL,
  ordernumber int(11) DEFAULT NULL,
  customwidth varchar(100) DEFAULT NULL,
  thumbnail varchar(200) DEFAULT NULL
);
GO

-- DELIMITER ; --
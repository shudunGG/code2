-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/11/26
-- 添加设计中台相关表结构 --徐剑

-- designstage_menu（栏目表）
create table if not exists designstage_menu
(
  menuguid            varchar(50) not null primary key,
  menuname            varchar(100) not null,
  parentmenuguid      varchar(50),
  menuicon            varchar(100),
  menustyle           varchar(20) not null,
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- designstage_page（页面表）
create table if not exists designstage_page
(
  pageguid            varchar(50) not null primary key,
  pagename            varchar(100) not null,
  menuguid            varchar(50) not null,
  outerchainurl       varchar(500),
  pagetype            varchar(20) not null,
  pagestatus          int,
  releasetime         datetime,
  pagedatatype        varchar(20),
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- designstage_recommend（首页推荐表）
create table if not exists designstage_recommend
(
  recommendguid       varchar(50) not null primary key,
  recommendtitle      varchar(200) not null,
  introduce           text not null,
  pageguid            varchar(50) not null,
  validationtype      varchar(20) not null,
  validationtime      datetime not null,
  ordernumber         int,
  creatorguid         varchar(50),
  gmtcreatetime       datetime,
  updateguid          varchar(50),
  gmtmodifiedtime     datetime
);
GO

-- designstage_updateinfo（更新说明表）
create table if not exists designstage_updateinfo
(
  infoguid            varchar(50) not null primary key,
  info                text,
  pageguid            varchar(50) not null,
  ordernumber         int,
  creatorguid         varchar(50),
  gmtcreatetime       datetime,
  updateguid          varchar(50),
  gmtmodifiedtime     datetime
);
GO

-- designstage_pagehistory（页面历史表）
create table if not exists designstage_pagehistory
(
  pageguid            varchar(50) not null primary key,
  pagename            varchar(100) not null,
  menuguid            varchar(50) not null,
  outerchainurl       varchar(500),
  pagetype            varchar(20) not null,
  pagestatus          int,
  releasetime         datetime,
  pagedatatype        varchar(20),
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime,
  deleteguid          varchar(50),
  gmtdeletetime       datetime
);
GO

-- designstage_document（文档表）
create table if not exists designstage_document
(
  documentguid        varchar(50) not null primary key,
  pictureurl          varchar(500),
  introduce           text,
  pageguid            varchar(50),
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- designstage_module（模块表）
create table if not exists designstage_module
(
  moduleguid          varchar(50) not null primary key,
  layouttype          int,
  documentguid        varchar(50) not null,
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- designstage_label（标签表）
create table if not exists designstage_label
(
  labelguid           varchar(50) not null primary key,
  labeltitle          varchar(100) not null,
  labeltype           int,
  introduce           text,
  iframeurl           varchar(500),
  moduleguid          varchar(50) not null,
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- designstage_demo（案例表）
create table if not exists designstage_demo
(
  demoguid            varchar(50) not null primary key,
  htmlcode            text,
  csscode             text,
  jscode              text,
  javacode            text,
  codeexplain         text,
  othercode           text,
  relationguid        varchar(50),
  relationtype        int,
  ordernumber         int,
  creatorguid         varchar(50),
  updateguid          varchar(50),
  gmtcreatetime       datetime,
  gmtmodifiedtime     datetime
);
GO

-- DELIMITER ; --
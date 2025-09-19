-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/26
-- 添加设计中台相关表结构 --徐剑

-- designstage_menu（栏目表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_menu'))
create table designstage_menu
   (
    menuguid            nvarchar(50) not null primary key,
    menuname            nvarchar(100) not null,
    parentmenuguid      nvarchar(50),
    menuicon            nvarchar(100),
    menustyle           nvarchar(20) not null,
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO

-- designstage_page（页面表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_page'))
create table designstage_page
   (
    pageguid            nvarchar(50) not null primary key,
    pagename            nvarchar(100) not null,
    menuguid            nvarchar(50) not null,
    outerchainurl       nvarchar(500),
    pagetype            nvarchar(20) not null,
    pagestatus          int,
    releasetime         datetime,
    pagedatatype        nvarchar(20),
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO

-- designstage_recommend（首页推荐表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_recommend'))
create table designstage_recommend
   (
    recommendguid       nvarchar(50) not null primary key,
    recommendtitle      nvarchar(200) not null,
    introduce           text not null,
    pageguid            nvarchar(50) not null,
    validationtype      nvarchar(20) not null,
    validationtime      datetime not null,
    ordernumber         int,
    creatorguid         nvarchar(50),
    gmtcreatetime       datetime,
    updateguid          nvarchar(50),
    gmtmodifiedtime     datetime
    );
GO

-- designstage_updateinfo（更新说明表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_updateinfo'))
create table designstage_updateinfo
   (
    infoguid            nvarchar(50) not null primary key,
    info                text,
    pageguid            nvarchar(50) not null,
    ordernumber         int,
    creatorguid         nvarchar(50),
    gmtcreatetime       datetime,
    updateguid          nvarchar(50),
    gmtmodifiedtime     datetime
    );
GO

-- designstage_pagehistory（页面历史表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_pagehistory'))
create table designstage_pagehistory
   (
    pageguid            nvarchar(50) not null primary key,
    pagename            nvarchar(100) not null,
    menuguid            nvarchar(50) not null,
    outerchainurl       nvarchar(500),
    pagetype            nvarchar(20) not null,
    pagestatus          int,
    releasetime         datetime,
    pagedatatype        nvarchar(20),
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime,
    deleteguid          nvarchar(50),
    gmtdeletetime       datetime
    );
GO

-- designstage_document（文档表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_document'))
create table designstage_document
   (
    documentguid        nvarchar(50) not null primary key,
    pictureurl          nvarchar(500),
    introduce           text,
    pageguid            nvarchar(50),
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO

-- designstage_module（模块表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_module'))
create table designstage_module
   (
    moduleguid          nvarchar(50) not null primary key,
    layouttype          int,
    documentguid        nvarchar(50) not null,
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO

-- designstage_label（标签表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_label'))
create table designstage_label
   (
    labelguid           nvarchar(50) not null primary key,
    labeltitle          nvarchar(100) not null,
    labeltype           int,
    introduce           text,
    iframeurl           nvarchar(500),
    moduleguid          nvarchar(50) not null,
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO

-- designstage_demo（案例表）
if not exists (select * from dbo.sysobjects where id = object_id('designstage_demo'))
create table designstage_demo
   (
    demoguid            nvarchar(50) not null primary key,
    htmlcode            text,
    csscode             text,
    jscode              text,
    javacode            text,
    codeexplain         text,
    othercode           text,
    relationguid        nvarchar(50),
    relationtype        int,
    ordernumber         int,
    creatorguid         nvarchar(50),
    updateguid          nvarchar(50),
    gmtcreatetime       datetime,
    gmtmodifiedtime     datetime
    );
GO
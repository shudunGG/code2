-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/15 【时间】
-- 新增列表配置 --薛炳

-- 添加表
CREATE TABLE
IF NOT EXISTS EpointsformTemplate (
	RowGuid Nvarchar (100) NOT NULL PRIMARY KEY,
	TemplateName Nvarchar (50),
	TemplateType Nvarchar (2),
	AddTemplateUrl Nvarchar (200),
	DetailTemplateUrl Nvarchar (200),
	WorkflowTemplateUrl Nvarchar (200),
	PrintDetailTemplateUrl Nvarchar (200),
	MobileAddTemplateUrl Nvarchar (200),
	MobileDetailTemplateUrl Nvarchar (200),
	MobileWorkflowTemplateUrl Nvarchar (200),
	ListTemplateUrl Nvarchar (200),
	MobileListTemplateUrl Nvarchar (200),
	OrderNum INT
);

GO
-- 添加表
 CREATE TABLE
IF NOT EXISTS EpointsformTableList (
	RowGuid varchar (100) NOT NULL PRIMARY KEY,
	TableId INT,
	SqlTableName varchar (100),
	TableType INT ,
	PageName varchar (100),
	OrderNum INT
);

GO
-- 添加表
CREATE TABLE
IF NOT EXISTS EpointsformListVersion (
	RowGuid varchar (100) NOT NULL PRIMARY KEY,
	ListGuid varchar (100),
	TemplateGuid varchar (100),
	Version varchar (10) ,
	Enabled int,
	PageVolume INT,
    Combination	 varchar (100),
    MobileCombination   varchar (100),
    FormListType             varchar (10),
    PageType                   varchar (10),
    MobileTemplateGuid       varchar (50),
    OrderNum int
);

GO
-- 添加表
CREATE TABLE
IF NOT EXISTS Epointsform (
	RowGuid varchar (100) NOT NULL PRIMARY KEY,
	TableId INT,
	SQlTableName varchar (100),
	TableType INT,
    FormName varchar (100),
    OrderNum int
);

GO

-- 添加表
CREATE TABLE
IF NOT EXISTS EpointFormVersion (
	RowGuid varchar (100) NOT NULL PRIMARY KEY,
	TableId int,
	TemplateGuid varchar (100),
	Version varchar (10) ,
	Enabled int,
	Content TEXT ,
    PreviewUrl varchar (100),
    JsContent TEXT,
    CssContent  TEXT,
    JsonData	  TEXT,
    controlsData	 TEXT,
    OrderNum int,
    TableGuid varchar (100)
);

GO

-- 添加表
CREATE TABLE
IF NOT EXISTS EpointsformExtensibleControl (
	ControlGuid VARCHAR (100) NOT NULL PRIMARY KEY,
	ControlName VARCHAR (100),
	ControlEnglishName VARCHAR (100),
	Version VARCHAR (10),
	AllowFieldType VARCHAR (100),
	Icon VARCHAR (2000),
	ControlServiceClass VARCHAR (100),
	OrderNum INT
);
GO

 
-- 添加字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'IsCustom') then
    alter table table_struct add column IsCustom varchar(2);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段增加'table_struct' 表中'CustomTableId'字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'CustomTableId') then
    alter table table_struct add column CustomTableId int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'CustomFieldname') then
    alter table table_struct add column CustomFieldname varchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- 添加字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_struct' and column_name = 'CustomChinesename') then
    alter table table_struct add column CustomChinesename varchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- 添加字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_fieldrelation_config' and column_name = 'RelationType') then
    alter table table_fieldrelation_config add column RelationType varchar(10);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加列表配置--季立霞
create table if not exists tablelist_schemeshowinfo
(
  rowguid     nvarchar(100) not null primary key,
  tableid     int,
  fieldid     int,
  isallowsort nvarchar(6),
  columntext  nvarchar(50),
  isadaptivewidth nvarchar(6),
  columnwidth nvarchar(50),
  columntype  nvarchar(50),
  controltype nvarchar(50),
  operatetype nvarchar(50),
  hyperlinkaddress nvarchar(200),
  addressopentype nvarchar(50),
  dialogtype  nvarchar(50),
  dialogtitle  nvarchar(100),
  dialogwidth  nvarchar(50),
  dialogheigh  nvarchar(50),
  icon    nvarchar(2000),
  customcolname  nvarchar(100),
  deleteprompt  nvarchar(100),
  listguid  nvarchar(100),
  versionguid  nvarchar(100),
  ordernum    int
);
GO


-- 添加列表高级配置--季立霞
create table if not exists tablelist_advancedconfig
(
  rowguid     nvarchar(100) not null primary key,
  conditiondescription  nvarchar(200),
  tableid     int,
  fieldid     int,
  comparison  nvarchar(10),
  valuetype   nvarchar(4),
  comparevalue  nvarchar(100),
  htmltemplate  nvarchar(200),
  showinfoguid   nvarchar(100),
  controltype  nvarchar(10),
  formattype  nvarchar(100),
  listguid  nvarchar(100),
  versionguid  nvarchar(100),
  ordernum    int
);
GO

-- 添加排序配置明细表--季立霞
create table if not exists tablelist_schemeorderinfo
(
    rowguid     nvarchar(100) not null primary key,
    tableid     int,
    fieldid     int,
    sortorder  nvarchar(50),
    listguid   nvarchar(100),
    versionguid  nvarchar(100),
    ordernum    int
);
GO

-- 添加筛选条件配置明细表--季立霞
create table if not exists tablelist_dataquery
(
    rowguid     nvarchar(100) not null primary key,
    conditionno   nvarchar(10),
    querytype    nvarchar(50),
    tableid     int,
    fieldid     int,
    valuetype  nvarchar(4),
    comparision   nvarchar(50),
    datavalue  nvarchar(50),
    description nvarchar(200),
    listguid  nvarchar(100),
    versionguid  nvarchar(100),
    ordernum    int
);
GO

-- 添加筛选条件配置明细表--季立霞
create table if not exists tablelist_searchareaconfig
(
    rowguid     nvarchar(100) not null primary key,
    querytext   nvarchar(10),
    tableid     int,
    fieldid     int,
    ctype       nvarchar(50),
    controltype nvarchar(50),
    querytype   nvarchar(50),
    rangetype   nvarchar(50),
    startconfig  nvarchar(200),
    endconfig  nvarchar(200),
    listguid    nvarchar(100),
    versionguid  nvarchar(100),
    ordernum    int
);
GO


-- 添加按钮显示配置表--季立霞
create table if not exists tablelist_buttonconfig
(
    rowguid    nvarchar(100) not null primary key,
    buttonname   nvarchar(100),
    buttontype     nvarchar(50),
    linkurl     nvarchar(200),
    processguid    nvarchar(200),
    processname    nvarchar(100),
    opentype nvarchar(50),
    dialogtype nvarchar(50),
    dialogtitle nvarchar(100),
    dialogwidth  nvarchar(50),
    dialogheigh  nvarchar(50),
    deleteprompt  nvarchar(100),
    eventselect  nvarchar(100),
    listguid  nvarchar(100),
    versionguid  nvarchar(100),
    ordernum    int
);
GO


-- 添加事件配置表--季立霞
create table if not exists tablelist_eventconfig
(
    rowguid     nvarchar(100) not null primary key,
    eventname   nvarchar(100),
    operatetype  nvarchar(50),
    eventtype  nvarchar(50),
    methodguid  nvarchar(200),
    synctype     nvarchar(6),
    ordernum    int
);
GO

-- DELIMITER ; --
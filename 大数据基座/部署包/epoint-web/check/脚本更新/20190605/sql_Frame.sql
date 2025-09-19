-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/15 【时间】
-- 新增列表配置 --薛炳

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('EpointsformTemplate'))
create table EpointsformTemplate 
   (
    RowGuid     nvarchar(100) not null primary key,
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
if not exists (select * from dbo.sysobjects where id = object_id('EpointsformTableList'))
create table EpointsformTableList  
   (
    RowGuid     nvarchar(100) not null primary key,
	TableId INT,
	SqlTableName varchar (100),
	TableType INT ,
	PageName varchar (100),
	OrderNum INT
    );
GO

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('EpointsformListVersion'))
create table EpointsformListVersion  
   (
    RowGuid     nvarchar(100) not null primary key,
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
if not exists (select * from dbo.sysobjects where id = object_id('Epointsform'))
create table Epointsform  
   (
    RowGuid     nvarchar(100) not null primary key,
	TableId INT,
	SQlTableName varchar (100),
	TableType INT,
    FormName varchar (100),
    OrderNum int
    );
GO

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('EpointFormVersion'))
create table EpointFormVersion   
   (
    RowGuid     nvarchar(100) not null primary key,
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
if not exists (select * from dbo.sysobjects where id = object_id('EpointsformExtensibleControl'))
create table EpointsformExtensibleControl    
   (
    ControlGuid      nvarchar(100) not null primary key,
	ControlName VARCHAR (100),
	ControlEnglishName VARCHAR (100),
	Version VARCHAR (10),
	AllowFieldType VARCHAR (100),
	Icon VARCHAR (2000),
	ControlServiceClass VARCHAR (100),
	OrderNum INT
    );
GO
-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='IsCustom' ) 
alter table table_struct add IsCustom  nvarchar(2); 
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='CustomTableId' ) 
alter table table_struct add CustomTableId  int; 
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='CustomFieldname' ) 
alter table table_struct add CustomFieldname  nvarchar(100); 
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='CustomChinesename' ) 
alter table table_struct add CustomChinesename  nvarchar(100); 
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('table_fieldrelation_config') and name='RelationType' ) 
alter table table_fieldrelation_config  add RelationType  nvarchar(2); 
GO

-- 添加列表配置--季立霞
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_schemeshowinfo'))
create table tablelist_schemeshowinfo
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
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_advancedconfig'))
create table tablelist_advancedconfig
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
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_schemeorderinfo'))
create table tablelist_schemeorderinfo
   (
               rowguid     nvarchar(100) not null primary key,
               tableid     int,
               fieldid     int,
               sortorder  nvarchar(50),
               listguid  nvarchar(100),
               versionguid  nvarchar(100),
               ordernum    int
    );
GO


-- 添加排序配置明细表--季立霞
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_dataquery'))
create table tablelist_dataquery
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


-- 添加查询区域显示配置明细表--季立霞
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_searchareaconfig'))
create table tablelist_searchareaconfig
   (
               rowguid     nvarchar(100) not null primary key,
               querytext   nvarchar(10),
               tableid     int,
               fieldid     int,
               ctype   nvarchar(50),
               controltype nvarchar(50),
               querytype    nvarchar(50),
               rangetype  nvarchar(50),
               startconfig  nvarchar(200),
               endconfig  nvarchar(200),
               listguid  nvarchar(100),
               versionguid  nvarchar(100),
               ordernum    int
    );
GO


-- 添加按钮显示配置表--季立霞
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_buttonconfig'))
create table tablelist_buttonconfig
   (
               rowguid     nvarchar(100) not null primary key,
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
if not exists (select * from dbo.sysobjects where id = object_id('tablelist_eventconfig'))
create table tablelist_eventconfig
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

 
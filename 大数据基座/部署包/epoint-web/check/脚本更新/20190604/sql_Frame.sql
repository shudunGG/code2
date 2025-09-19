-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/06/04

-- TableStruct表新增DateFormatType字段--季立霞
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='DateFormatType' ) 
alter table table_struct add DateFormatType nvarchar(20); 
GO

-- TableStruct表新增 isFrameUser字段--季立霞
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='isFrameUser' ) 
alter table table_struct add isFrameUser nvarchar(2); 
GO

-- TableStruct表新增 isFrameOu字段--季立霞
if not exists (select name from syscolumns  where id = object_id('table_struct') and name='isFrameOu' ) 
alter table table_struct add isFrameOu nvarchar(2); 
GO

-- tablebasicinfo表添加自定义addurl字段
if not exists (select name from syscolumns  where id = object_id('table_basicinfo') and name='AddUrl' ) 
alter table table_basicinfo add  AddUrl nvarchar(200); 
GO

-- tablebasicinfo表添加自定义editurl字段
if not exists (select name from syscolumns  where id = object_id('table_basicinfo') and name='EditUrl' ) 
alter table table_basicinfo add  EditUrl nvarchar(200); 
GO

-- tablebasicinfo表添加自定义detailurl字段
if not exists (select name from syscolumns  where id = object_id('table_basicinfo') and name='DetailUrl' ) 
alter table table_basicinfo add  DetailUrl nvarchar(200); 
GO


-- 添加系统保留字段配置表table_systemstruct_config
if not exists (select * from dbo.sysobjects where id = object_id('table_systemstruct_config'))
create table table_systemstruct_config
   (
               rowguid   nvarchar(100) not null primary key,
               tableid int,
               tablename  nvarchar(100),
               sysfieldid int,
               sysfieldname  nvarchar(100)
    );
GO

-- 添加子父表关联字段配置表table_fieldrelation_config
if not exists (select * from dbo.sysobjects where id = object_id('table_fieldrelation_config'))
create table table_fieldrelation_config
   (
               rowguid   nvarchar(100) not null primary key,
               maintableid int,
               maintablename  nvarchar(100),
               mainfieldid int,
               mainfieldname nvarchar(100),
               goaltableid int,
               goaltablename  nvarchar(100),
               goalfieldid int,
               goalfieldname nvarchar(100)
    );
GO

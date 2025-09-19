-- 2019/8/27 【时间】
-- 更新门户设计相关表 --【徐剑】

-- frame_portal表

-- frame_portal表添加widthtype字段
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='widthtype' ) 
alter table frame_portal add widthtype  nvarchar(20);
GO

-- 添加字段requestVolumeThreshold
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='pagewidth' ) 
alter table frame_portal add pagewidth  int; 
GO

-- 添加字段errorThresholdPercentage
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='pagepercent' ) 
alter table frame_portal add pagepercent  int; 
GO

-- 添加字段sleepWindowInMilliseconds
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='elegrid' ) 
alter table frame_portal add elegrid  int; 
GO

-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='elemove' ) 
alter table frame_portal add elemove  int; 
GO

-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='eleshow' ) 
alter table frame_portal add eleshow  int; 
GO

-- 添加字段apidata
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='elescale' ) 
alter table frame_portal add elescale  int; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal'
SET @columnname='layouttempguid'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal') and name='layouttempguid') 
alter table frame_portal drop COLUMN layouttempguid; 
GO


DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='mangeurl'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_component_template') and name='mangeurl') 
alter table frame_component_template drop COLUMN mangeurl; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='showurl'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_component_template') and name='showurl') 
alter table frame_component_template drop COLUMN showurl; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='templateheight'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_component_template') and name='templateheight') 
alter table frame_component_template drop COLUMN templateheight ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='moreopenwith'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_component_template') and name='moreopenwith') 
alter table frame_component_template drop COLUMN moreopenwith ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='customtitleheight'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_component_template') and name='customtitleheight') 
alter table frame_component_template drop COLUMN customtitleheight ; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='sizex' ) 
alter table frame_component_template add sizex  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='sizey' ) 
alter table frame_component_template add sizey  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='openwith') 
alter table frame_component_template add openwith  nvarchar(20); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='themeCheck') 
alter table frame_component_template add themeCheck  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='framecolor') 
alter table frame_component_template add framecolor  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='framesize') 
alter table frame_component_template add framesize  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='backgroundcolor') 
alter table frame_component_template add backgroundcolor  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='shadow') 
alter table frame_component_template add shadow  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='radius') 
alter table frame_component_template add radius  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='isshowtitle') 
alter table frame_component_template add isshowtitle  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='title') 
alter table frame_component_template add title  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='fontcolor') 
alter table frame_component_template add fontcolor  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='titlebackgroundcolor') 
alter table frame_component_template add titlebackgroundcolor  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='iconcolor') 
alter table frame_component_template add iconcolor  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='isshowmorebutton') 
alter table frame_component_template add isshowmorebutton  int; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_component_template'
SET @columnname='moreurl'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if not exists (select * from information_schema.columns  where  table_name = 'frame_component_template' and column_name='moreurl' and character_maximum_length=2000) 
alter table frame_component_template 
alter column moreurl nvarchar(2000);  
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='isshowrefresh') 
alter table frame_component_template add isshowrefresh  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='isshownewbutton') 
alter table frame_component_template add isshownewbutton  int; 
GO
if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='newurl') 
alter table frame_component_template add newurl nvarchar(2000); 
GO
if not exists (select name from syscolumns  where id = object_id('frame_component_template') and name='elemanageurl') 
alter table frame_component_template add elemanageurl  nvarchar(2000); 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='customlinkurl'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='customlinkurl') 
alter table frame_portal_element drop COLUMN customlinkurl ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='infocount'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='infocount') 
alter table frame_portal_element drop COLUMN infocount ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='titlelength'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='titlelength') 
alter table frame_portal_element drop COLUMN titlelength ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='moreopenwith'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='moreopenwith') 
alter table frame_portal_element drop COLUMN moreopenwith ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='height'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='height') 
alter table frame_portal_element drop COLUMN height ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='extendcustomattr'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='extendcustomattr') 
alter table frame_portal_element drop COLUMN extendcustomattr ; 
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='belonglayoutguid'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='belonglayoutguid') 
alter table frame_portal_element drop COLUMN belonglayoutguid ; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='maxstart') 
alter table frame_portal_element add maxstart  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='maxend') 
alter table frame_portal_element add maxend  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='minstart') 
alter table frame_portal_element add minstart  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='minend') 
alter table frame_portal_element add minend  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='themecheck') 
alter table frame_portal_element add themecheck  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='visible') 
alter table frame_portal_element add visible  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='isshownewbutton') 
alter table frame_portal_element add isshownewbutton  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='newurl') 
alter table frame_portal_element add newurl   nvarchar(2000);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='framesize') 
alter table frame_portal_element add framesize   nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='shadow') 
alter table frame_portal_element add shadow   nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='radius') 
alter table frame_portal_element add radius  nvarchar(50);
GO

DECLARE @tablename VARCHAR(100), @columnname VARCHAR(100), @tab VARCHAR(100)
SET @tablename='frame_portal_element'
SET @columnname='moreurl'
declare @defname varchar(100)
declare @cmd varchar(100)
select @defname = name FROM sysobjects so 
inner JOIN sysconstraints sc ON so.id = sc.constid
WHERE object_name(so.parent_obj) = @tablename 
AND so.xtype = 'D'
AND sc.colid =(SELECT colid FROM syscolumns
WHERE id = object_id(@tablename) AND name = @columnname)
set @cmd='alter table '+ @tablename+ ' drop constraint '+ @defname
if @cmd is null print 'No default constraint to drop'
exec (@cmd)
if  exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='moreurl') 
alter table frame_portal_element drop COLUMN moreurl ; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='iconcolor') 
alter table frame_portal_element add iconcolor   nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='belongtype') 
alter table frame_portal_element add belongtype  nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='personalportalguid') 
alter table frame_portal_element add personalportalguid   nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='personalelementguid') 
alter table frame_portal_element add personalelementguid  nvarchar(50);
GO


if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='extendattributes') 
alter table frame_portal_element add extendattributes text;
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='sizex') 
alter table frame_portal_element add sizex  int;
GO

if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='sizey') 
alter table frame_portal_element add sizey  int;
GO

if  exists (select * from information_schema.columns  where  table_name = 'frame_portal_element' and column_name='belongportalguid') 
exec sp_rename 'frame_portal_element.belongportalguid','belongguid';
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_portal_template'))
create table frame_portal_template
   (
      rowguid               nvarchar(50) not null primary key,
  templatename          nvarchar(100),
  templateimg           nvarchar(2000),
  belonguserguid        nvarchar(50),
  templatetype          nvarchar(20),
  belongprivateguid     nvarchar(50),
  ordernumber           int,
  widthtype             nvarchar(20),
  pagewidth             int,
  pagepercent           int,
  elegrid               int,
  eleruler              int,
  elemove               int,
  eleshow               int,
  elescale              int
    );
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_portal_column'))
create table frame_portal_column
   (
       rowguid               nvarchar(50) not null primary key,
  columnname            nvarchar(100),
  columnvalue           nvarchar(100),
  columndatanum         int,
  belongelementguid     nvarchar(50),
  isdiylink             int,
  columnurl             nvarchar(2000),
  counturl              nvarchar(2000),
  parentcolumnguid      nvarchar(50),
  isdefault             int,
  isshownum             int,
  ordernumber           int
    );
GO
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='columndatanum') 
alter table frame_portal_column add columndatanum  int;
GO
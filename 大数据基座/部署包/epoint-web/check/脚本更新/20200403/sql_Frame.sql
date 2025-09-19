-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/01 【时间】
-- 新增门户元件表，门户栏目表、门户元件表增加字段 -- 俞俊男

-- 门户元件表[frame_portal_element]添加字段isshowtitlecount
if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='isshowtitlecount' ) 
alter table frame_portal_element add isshowtitlecount  int; 
GO

-- 门户栏目表[frame_portal_column]添加字段isshowrefresh
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='isshowrefresh' ) 
alter table frame_portal_column add isshowrefresh  int; 
GO

-- 门户栏目表[frame_portal_column]添加字段isshowmorebutton
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='isshowmorebutton' ) 
alter table frame_portal_column add isshowmorebutton  int; 
GO

-- 门户栏目表[frame_portal_column]添加字段isshownewbutton
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='isshownewbutton' ) 
alter table frame_portal_column add isshownewbutton  int; 
GO

-- 门户栏目表[frame_portal_column]添加字段moreurl
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='moreurl' ) 
alter table frame_portal_column add moreurl  varchar(1000); 
GO

-- 门户栏目表[frame_portal_column]添加字段addurl
if not exists (select name from syscolumns  where id = object_id('frame_portal_column') and name='addurl' ) 
alter table frame_portal_column add addurl  varchar(1000); 
GO

-- 新增门户元件表 
if not exists (select * from dbo.sysobjects where id = object_id('frame_portal_component'))
create table frame_portal_component (
  rowguid varchar(50) not null primary key,
  componentname varchar(50),
  componenttype int,
  belongcategory varchar(50),
  componenturl varchar(500),
  columnvalue varchar(50),
  columnname varchar(100),
  isdiylink int,
  manageurl varchar(200),
  visible int,
  initwidth int,
  initheight int,
  maxwidth int,
  minwidth int,
  maxheight int,
  minheight int,
  allowedit int,
  openwith varchar(50),
  themecheck int,
  framecolor varchar(50),
  framesize int,
  backgroundcolor varchar(50),
  shadow varchar(50),
  radius varchar(50),
  isshowtitle int,
  fontcolor varchar(50),
  titlebackgroundcolor varchar(50),
  iconcolor varchar(50),
  icon varchar(200),
  isshowmessagecount int,
  isshowrefresh int,
  isshowmorebutton int,
  isshownewbutton int,
  moreurl varchar(200),
  addurl varchar(2000),
  ordernumber int,
  counturl varchar(500)
);
GO

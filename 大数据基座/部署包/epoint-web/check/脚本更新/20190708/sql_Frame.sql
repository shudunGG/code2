-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/7/8
-- appinfo中添加三个字段，用于移动应用 --王颜
if not exists (select name from syscolumns  where id = object_id('app_info') and name='platform' ) 
 alter table app_info add  platform nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='logo' ) 
 alter table app_info add  logo nvarchar(2000);
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='IsExternal' ) 
alter table app_info add  IsExternal int;
GO

-- appmodule中添加两个字段，用于移动应用
if not exists (select name from syscolumns  where id = object_id('app_module') and name='platform' ) 
alter table app_module add  platform nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('app_module') and name='IsEnter' ) 
alter table app_module add  IsEnter int;
GO

-- 添加应用参数
if not exists (select * from dbo.sysobjects where id = object_id('app_param'))
create table app_param
   (  
  rowguid              nvarchar(50) not null primary key,
  paramname           nvarchar(50),
  paramvalue           nvarchar(1000),
  appguid           nvarchar(50),
  moduleguid         nvarchar(50),
  description           nvarchar(500),  
  paramtype          int,
  ordernum           int,
  createdate          datetime,
  isshowmobile        int
    );
GO

-- 添加移动设备表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_device'))
create table mobile_device
   (
      rowguid              nvarchar(50) not null primary key,
  userguid          nvarchar(50),
  deviceid           nvarchar(50),
  appguid           nvarchar(50),
  deviceinfo           nvarchar(200),  
  registdate          datetime,
  lastusedate          datetime,
  enable           int,
  appversion           nvarchar(50),
  description          nvarchar(50),
  devicedetailinfo     nvarchar(100)
    );
GO

-- 添加移动错误日志表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_errorlog'))
create table mobile_errorlog
   (
      rowguid              nvarchar(50) not null primary key,
  userguid            nvarchar(50),
  loginid           nvarchar(50),
  displayname           nvarchar(50),
  appguid           nvarchar(50),
  logcontent         text,
  appversion      nvarchar(50),
  systemversion    nvarchar(50),
  devicemodel      nvarchar(100),   
  manufacturer     nvarchar(100),  
  uploaddate     datetime
    );
GO

-- 添加移动个人名片表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_personnalcard'))
create table mobile_personnalcard
   (
  rowguid              nvarchar(50) not null primary key,
  shorturl            nvarchar(200),
  userguid           nvarchar(200),
  showmobile           int,
  showouname            int,
  showmail                int,
  showtitle               int,
  showaddress            int,
  recordid               nvarchar(200),
  empaddress             nvarchar(200)
    );
GO

-- 添加移动信息更新表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_update'))
create table mobile_update
   (
   rowguid              nvarchar(50) not null primary key,
  appguid           nvarchar(50),
  platform           nvarchar(50),
  versionname            nvarchar(50),
  message                text,
  enable           int,
  must             int,
  createdate       datetime,
  optdate          datetime,
  filename         nvarchar(100),
  url              nvarchar(500),
  plisturl          nvarchar(500),
  packagename        nvarchar(200),
  downloadnum       int
    );
GO

-- 添加移动外部应用人员添加表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_user'))
create table mobile_user
   (
  userguid              nvarchar(50) not null primary key,
  loginid           nvarchar(50),
  displayname           nvarchar(50),
  enable           int,
  appguid         nvarchar(50),
  createdate          datetime
    );
GO

-- 添加移动二维码生成表
if not exists (select * from dbo.sysobjects where id = object_id('mobile_validatecode'))
create table mobile_validatecode
   (
  rowguid              nvarchar(50) not null primary key,
   code               int,
  createDate         datetime,
  enable              int,
  userguid               nvarchar(50),
   appguid           nvarchar(50)
    );
GO
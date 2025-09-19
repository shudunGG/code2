-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/7/8

-- appinfo中添加三个字段，用于移动应用 --王颜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'platform') then
    alter table app_info add column platform nvarchar(50);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'logo') then
    alter table app_info add column logo nvarchar(2000);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'IsExternal') then
    alter table app_info add column IsExternal int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- appmodule中添加两个字段，用于移动应用
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_module' and column_name = 'platform') then
    alter table app_module add column platform nvarchar(50);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_module' and column_name = 'IsEnter') then
    alter table app_module add column IsEnter int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加应用参数
create table if not exists app_param
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
create table if not exists mobile_device
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
create table if not exists mobile_errorlog
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
create table if not exists mobile_personnalcard
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
create table if not exists mobile_update
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
create table if not exists mobile_user
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
create table if not exists mobile_validatecode
(  
  rowguid              nvarchar(50) not null primary key,
   code               int,
  createDate         datetime,
  enable              int,
  userguid               nvarchar(50),
   appguid           nvarchar(50)
);
GO

-- DELIMITER ; --
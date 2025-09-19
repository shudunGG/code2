-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/01 【时间】
-- 新增门户元件表，门户栏目表、门户元件表增加字段 -- 俞俊男

-- 门户元件表[frame_portal_element]添加字段isshowtitlecount
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_element' and column_name = 'isshowtitlecount') then
    alter table frame_portal_element add column isshowtitlecount int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户栏目表[frame_portal_column]添加字段isshowrefresh
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_column' and column_name = 'isshowrefresh') then
    alter table frame_portal_column add column isshowrefresh int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户栏目表[frame_portal_column]添加字段isshowmorebutton
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_column' and column_name = 'isshowmorebutton') then
    alter table frame_portal_column add column isshowmorebutton int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户栏目表[frame_portal_column]添加字段isshownewbutton
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_column' and column_name = 'isshownewbutton') then
    alter table frame_portal_column add column isshownewbutton int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户栏目表[frame_portal_column]添加字段moreurl
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_column' and column_name = 'moreurl') then
    alter table frame_portal_column add column moreurl varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户栏目表[frame_portal_column]添加字段addurl
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_column' and column_name = 'addurl') then
    alter table frame_portal_column add column addurl varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 新增门户元件表 
create table if not exists frame_portal_component (
  rowguid varchar(50) not null primary key,
  componentname varchar(50),
  componenttype int(11),
  belongcategory varchar(50),
  componenturl varchar(500),
  columnvalue varchar(50),
  columnname varchar(100),
  isdiylink int(11),
  manageurl varchar(200),
  visible int(11),
  initwidth int(11),
  initheight int(11),
  maxwidth int(11),
  minwidth int(11),
  maxheight int(11),
  minheight int(11),
  allowedit int(11),
  openwith varchar(50),
  themecheck int(11),
  framecolor varchar(50),
  framesize int(11),
  backgroundcolor varchar(50),
  shadow varchar(50),
  radius varchar(50),
  isshowtitle int(11),
  fontcolor varchar(50),
  titlebackgroundcolor varchar(50),
  iconcolor varchar(50),
  icon varchar(200),
  isshowmessagecount int(11),
  isshowrefresh int(11),
  isshowmorebutton int(11),
  isshownewbutton int(11),
  moreurl varchar(200),
  addurl varchar(2000),
  ordernumber int(11),
  counturl varchar(500)
);
GO

-- DELIMITER ; --
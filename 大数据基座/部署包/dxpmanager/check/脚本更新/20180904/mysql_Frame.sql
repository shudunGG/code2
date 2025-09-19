-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/09/04 【时间】
-- 门户、元件 表等同步9.2.9相关功能，字段添加--季立霞

-- 添加门户相关字段
-- 添加布局模版guid字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'layouttempguid') then
    alter table frame_portal add column layouttempguid varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加所属类别字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'typeguid') then
    alter table frame_portal add column typeguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加描述字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'description') then
    alter table frame_portal add column description varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加创建用户guid字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'userguid') then
    alter table frame_portal add column userguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加创建部门guid字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'ouguid') then
    alter table frame_portal add column ouguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加创建独立管理部门guid字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'baseouguid') then
    alter table frame_portal add column baseouguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加默认展示字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal' and column_name = 'defaultdisplay') then
    alter table frame_portal add column defaultdisplay int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 添加门户权限相关字段
-- 添加righttype字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portalright' and column_name = 'righttype') then
    alter table frame_portalright add column righttype varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 新增门户类别表 
create table if not exists frame_portaltype
(   
   rowguid     varchar(50) not null primary key,
   typename    varchar(50),
   ordernumber int
);
GO



-- 新增门户元件表 
create table if not exists frame_portal_element
(
   rowguid                varchar(50) not null primary key,
   belongportalguid       varchar(50),
   rowindex               int,
   colindex               int,
   belongelementtempguid  varchar(50),
   title                  varchar(50),
   icon                   varchar(200),
   fontcolor              varchar(50),
   backgroundcolor        varchar(50),
   titlebackgroundcolor   varchar(50),
   customlinkurl          varchar(200),
   infocount              int,
   titlelength            int,
   openwith               varchar(50),
   isshowtitle            int,
   isshowmorebutton       int,
   isshowrefresh          int,
   moreopenwith           varchar(50),
   framecolor             varchar(50),
   height                 int,
   extendcustomattr       varchar(1000),
   belonglayoutguid       varchar(50)
);
GO


-- 新增元件模板表 
create table if not exists frame_component_template (
  rowguid varchar(50) not null primary key,
  componentname varchar(50),
  componenttype varchar(50),
  ordernumber int(11),
  mangeurl varchar(200),
  showurl varchar(200),
  showicon varchar(200),
  templateheight int(11),
  moreurl varchar(200),
  moreopenwith varchar(50),
  customtitleheight int(11),
  appguid varchar(50)
);
GO


-- 新增布局模板表
create table if not exists frame_layout_template(
  rowguid varchar(50) not null primary key,
  templatename varchar(50),
  ordernumber int(11),
  customwidth varchar(100),
  thumbnail varchar(200)
);
GO

-- 添加拓展配置表
create table if not exists frame_exttabsconfig
(
  rowguid              varchar(50)  not null primary key,
  extname              varchar(50),
  exturl               varchar(50),
  opentype             varchar(50),
  exticon              varchar(50),
  exttype              int(11)
);
GO

-- DELIMITER ; --
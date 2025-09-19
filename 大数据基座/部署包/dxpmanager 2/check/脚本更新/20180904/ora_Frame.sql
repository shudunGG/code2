-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/04 【时间】
-- 门户、元件 表等同步9.2.9相关功能，字段添加--季立霞

-- 添加门户相关字段
-- 添加布局模版guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('layouttempguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add layouttempguid  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- 添加所属类别字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('typeguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add typeguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 添加描述字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('description');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add description  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 添加创建用户guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('userguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add userguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 添加创建部门guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('ouguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add ouguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 添加创建独立管理部门guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add baseouguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 添加默认展示字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('defaultdisplay');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add defaultdisplay  integer';
  end if;
  end;
end;
/* GO */


-- 添加门户权限相关字段
-- 添加righttype字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portalright') and column_name = upper('righttype');
  if (isexist = 0) then
    execute immediate 'alter table frame_portalright add righttype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- 新增门户类别表 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portaltype');
 if (isexist = 0) then
    execute immediate '
       create table  frame_portaltype
       (   
          rowguid     nvarchar2(50) not null primary key,
          typename    nvarchar2(50),
          ordernumber integer
       )';
  end if;
  end;
end;
/* GO */


-- 新增门户元件表 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element');
 if (isexist = 0) then
    execute immediate 'create table  frame_portal_element
(
   rowguid                nvarchar2(50) not null primary key,
   belongportalguid       nvarchar2(50),
   rowindex               integer,
   colindex               integer,
   belongelementtempguid  nvarchar2(50),
   title                  nvarchar2(50),
   icon                   nvarchar2(200),
   fontcolor              nvarchar2(50),
   backgroundcolor        nvarchar2(50),
   titlebackgroundcolor   nvarchar2(50),
   customlinkurl          nvarchar2(200),
   infocount              integer,
   titlelength            integer,
   openwith               nvarchar2(50),
   isshowtitle            integer,
   isshowmorebutton       integer,
   isshowrefresh          integer,
   moreopenwith           nvarchar2(50),
   framecolor             nvarchar2(50),
   height                 integer,
   extendcustomattr       nvarchar2(1000),
   belonglayoutguid       nvarchar2(50)
)';
  end if;
  end;
end;
/* GO */


-- 新增元件模板表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template');
 if (isexist = 0) then
    execute immediate '
       create table frame_component_template (
  rowguid nvarchar2(50) not null primary key,
  componentname nvarchar2(50),
  componenttype nvarchar2(50),
  ordernumber INTEGER,
  mangeurl nvarchar2(200),
  showurl nvarchar2(200),
  showicon nvarchar2(200),
  templateheight INTEGER,
  moreurl nvarchar2(200),
  moreopenwith nvarchar2(50),
  customtitleheight  integer,
  appguid nvarchar2(50)
)';
  end if;
  end;
end;
/* GO */

-- 新增布局模板表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_layout_template');
 if (isexist = 0) then
    execute immediate '
      create table frame_layout_template(
  rowguid nvarchar2(50) not null primary key,
  templatename nvarchar2(50),
  ordernumber INTEGER,
  customwidth nvarchar2(100),
  thumbnail nvarchar2(200)
)';
  end if;
  end;
end;
/* GO */

-- 添加拓展配置表 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_exttabsconfig');
 if (isexist = 0) then
    execute immediate '
      create table frame_exttabsconfig
             (
               rowguid     nvarchar2(50) not null primary key,
               extname     nvarchar2(50),
 			   exturl      nvarchar2(50),
               opentype    nvarchar2(50),
               exticon     nvarchar2(50),
               exttype     integer
              )';
  end if;
  end;
end;
/* GO */

-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/04/01 【时间】
-- 新增门户元件表，门户栏目表、门户元件表增加字段 -- 俞俊男

-- 门户元件表[frame_portal_element]添加字段isshowtitlecount
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('isshowtitlecount');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add isshowtitlecount  integer';
  end if;
  end;
end;
/* GO */

-- 门户栏目表[frame_portal_column]添加字段isshowrefresh
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('isshowrefresh');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add isshowrefresh  integer';
  end if;
  end;
end;
/* GO */

-- 门户栏目表[frame_portal_column]添加字段isshowmorebutton
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('isshowmorebutton');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add isshowmorebutton  integer';
  end if;
  end;
end;
/* GO */

-- 门户栏目表[frame_portal_column]添加字段isshownewbutton
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('isshownewbutton');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add isshownewbutton  integer';
  end if;
  end;
end;
/* GO */

-- 门户栏目表[frame_portal_column]添加字段moreurl
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('moreurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add moreurl  nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- 门户栏目表[frame_portal_column]添加字段addurl
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('addurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add addurl  nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- 新增门户元件表 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_component');
 if (isexist = 0) then
    execute immediate '
       create table frame_portal_component (
  rowguid nvarchar2(50) not null primary key,
  componentname nvarchar2(50),
  componenttype integer,
  belongcategory nvarchar2(50),
  componenturl nvarchar2(500),
  columnvalue nvarchar2(50),
  columnname nvarchar2(100),
  isdiylink integer,
  manageurl nvarchar2(200),
  visible integer,
  initwidth integer,
  initheight integer,
  maxwidth integer,
  minwidth integer,
  maxheight integer,
  minheight integer,
  allowedit integer,
  openwith nvarchar2(50),
  themecheck integer,
  framecolor nvarchar2(50),
  framesize integer,
  backgroundcolor nvarchar2(50),
  shadow nvarchar2(50),
  radius nvarchar2(50),
  isshowtitle integer,
  fontcolor nvarchar2(50),
  titlebackgroundcolor nvarchar2(50),
  iconcolor nvarchar2(50),
  icon nvarchar2(200),
  isshowmessagecount integer,
  isshowrefresh integer,
  isshowmorebutton integer,
  isshownewbutton integer,
  moreurl nvarchar2(200),
  addurl nvarchar2(2000),
  ordernumber integer,
  counturl nvarchar2(500)
)';
  end if;
  end;
end;
/* GO */

-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/8/27 【时间】
-- 更新门户设计相关表 --【徐剑】

-- frame_portal表

-- frame_portal表添加widthtype字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('widthtype');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add widthtype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
-- frame_portal表添加pagewidth字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('pagewidth');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add pagewidth  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('pagepercent');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add pagepercent  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('elegrid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add elegrid  number';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('eleruler');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add eleruler  number';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('elemove');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add elemove  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('eleshow');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add eleshow  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('elescale');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal add elescale  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal') and column_name = upper('layouttempguid');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal drop column layouttempguid';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('mangeurl');
  if (isexist = 1) then
   execute immediate 'alter table frame_component_template drop column mangeurl';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('showurl');
  if (isexist = 1) then
   execute immediate 'alter table frame_component_template drop column showurl';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('templateheight');
  if (isexist = 1) then
   execute immediate 'alter table frame_component_template drop column templateheight';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('moreopenwith');
  if (isexist = 1) then
   execute immediate 'alter table frame_component_template drop column moreopenwith';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('customtitleheight');
  if (isexist = 1) then
   execute immediate 'alter table frame_component_template drop column customtitleheight';
  end if;
    end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('sizex');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add sizex  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('sizey');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add sizey number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('themeCheck');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add themeCheck  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('openwith');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add openwith nvarchar2(20)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('framecolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add framecolor  nvarchar2(20)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('framesize');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add framesize  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('backgroundcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add backgroundcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('shadow');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add shadow  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('radius');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add radius  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('isshowtitle');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add isshowtitle  number';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('title');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add title  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('fontcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add fontcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('titlebackgroundcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add titlebackgroundcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('iconcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add iconcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('isshowmorebutton');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add isshowmorebutton  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('moreurl') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template modify moreurl  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('isshowrefresh');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add isshowrefresh  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('isshownewbutton');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add isshownewbutton  number';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('newurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add newurl  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template') and column_name = upper('elemanageurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_component_template add elemanageurl  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */




begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('customlinkurl');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column customlinkurl';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('infocount');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column infocount';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('titlelength');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column titlelength';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('moreopenwith');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column moreopenwith';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('height');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column height';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('belonglayoutguid');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column belonglayoutguid';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('extendcustomattr');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column extendcustomattr';
  end if;
    end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('maxstart');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add maxstart  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('maxend');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add maxend  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('minstart');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add minstart  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('minend');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add minend  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('themecheck');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add themecheck  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('visible');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add visible  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('isshownewbutton');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add isshownewbutton  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('newurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add newurl  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('framesize');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add framesize  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('extendcustomattr');
  if (isexist = 1) then
   execute immediate 'alter table frame_portal_element drop column moreurl';
  end if;
    end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('shadow');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add shadow  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('radius');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add radius  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('iconcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add iconcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('iconcolor');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add iconcolor  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('belongtype');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add belongtype  nvarchar2(20)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('belongportalguid');
  if (isexist = 1) then
    execute immediate 'alter table frame_portal_element rename  column belongportalguid to belongguid';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('personalportalguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add personalportalguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('personalelementguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add personalelementguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('personalelementguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add personalelementguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('extendattributes');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add extendattributes  clob';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('sizex');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add sizex  number';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('sizey');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add sizey  number';
  end if;
  end;
end;
/* GO */

-- 添加更新提醒信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column');
 if (isexist = 0) then
    execute immediate'
      create table frame_portal_column(
               rowguid               nvarchar2(50) not null primary key,
               columnname            nvarchar2(100),
               columnvalue           nvarchar2(100),
               columndatanum         number,
              belongelementguid     nvarchar2(50),
               isdiylink             number,
                columnurl             nvarchar2(2000),
                counturl              nvarchar2(2000),
                parentcolumnguid      nvarchar2(50),
                isdefault             number,
                isshownum             number,
                ordernumber           number
              )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_template');
 if (isexist = 0) then
    execute immediate'
      create table frame_portal_template(
              rowguid               nvarchar2(50) not null primary key,
              templatename          nvarchar2(100),
              templateimg           nvarchar2(2000),
  belonguserguid        nvarchar2(50),
  templatetype          nvarchar2(20),
  belongprivateguid     nvarchar2(50),
  ordernumber           number,
  widthtype             nvarchar2(20),
  pagewidth             number,
  pagepercent           number,
  elegrid               number,
  eleruler              number,
  elemove               number,
  eleshow               number,
  elescale              number
              )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_column') and column_name = upper('columndatanum');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_column add columndatanum  number';
  end if;
  end;
end;
/* GO */

-- end;



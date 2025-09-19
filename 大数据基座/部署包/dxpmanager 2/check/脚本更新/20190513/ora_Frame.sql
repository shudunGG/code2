-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/05/09【时间】
--表api_runtime_alert_rule添加字段ruletype  api_runtime_alert_info表
-- api_runtime_handle_rule表添加

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('TitleFieldName');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column TitleFieldName';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('YFieldName');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column YFieldName';
  end if;
    select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('XFieldName');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column XFieldName';
  end if;
    select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('IsDisable');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column IsDisable';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('ChartType');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column ChartType';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('GridShowField');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column GridShowField';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('IconStore');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column IconStore';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('PortaletType');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column PortaletType';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('SSOUrl');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column SSOUrl';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('MoreButtonLinkUrl');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column MoreButtonLinkUrl';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('AllowMoreButton');
  if (isexist = 1) then
    execute immediate 'alter table appmanage_publicelement drop column AllowMoreButton';
  end if;
  
  end;
end;
/* GO */
-- end;



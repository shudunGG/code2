-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/12/11 --【薛炳】
-- 修改表单版本JsContent字段类型改为longtext
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('JsContent') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = JsContent';
    execute immediate 'alter table epointformversion drop column JsContent';
    execute immediate 'alter table epointformversion rename column newColumn to JsContent';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('Content') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = Content';
    execute immediate 'alter table epointformversion drop column Content';
    execute immediate 'alter table epointformversion rename column newColumn to Content';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('CssContent') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = CssContent';
    execute immediate 'alter table epointformversion drop column CssContent';
    execute immediate 'alter table epointformversion rename column newColumn to CssContent';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('JsonData') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = JsonData';
    execute immediate 'alter table epointformversion drop column JsonData';
    execute immediate 'alter table epointformversion rename column newColumn to JsonData';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('controlsData') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = controlsData';
    execute immediate 'alter table epointformversion drop column controlsData';
    execute immediate 'alter table epointformversion rename column newColumn to controlsData';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('htmlData') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add newcolumn CLOB';
    execute immediate 'update epointformversion set newcolumn = htmlData';
    execute immediate 'alter table epointformversion drop column htmlData';
    execute immediate 'alter table epointformversion rename column newColumn to htmlData';
  end if;
  end;
end;
/* GO */
-- end;

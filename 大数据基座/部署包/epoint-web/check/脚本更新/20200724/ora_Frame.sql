-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/07/24--【薛炳】

-- 修改table_basicinfo表mergeformids字段类型改为longtext
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('mergeformids') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add newcolumn CLOB';
    execute immediate 'update table_basicinfo set newcolumn = mergeformids';
    execute immediate 'alter table table_basicinfo drop column mergeformids';
    execute immediate 'alter table table_basicinfo rename column newColumn to mergeformids';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_tablerelation') and column_name = upper('businesstableid') and data_type=upper('CLOB');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_tablerelation add newcolumn CLOB';
    execute immediate 'update epointsform_tablerelation set newcolumn = businesstableid';
    execute immediate 'alter table epointsform_tablerelation drop column businesstableid';
    execute immediate 'alter table epointsform_tablerelation rename column newColumn to businesstableid';
  end if;
  end;
end;
/* GO */

 
-- end;

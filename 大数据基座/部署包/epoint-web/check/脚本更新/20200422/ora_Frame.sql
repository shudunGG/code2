-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- api_info表urlpattern字段可为空，（跳转pattern，逻辑上可为空）

begin
  declare isexist number;
  begin
  select count(1) into isexist  from user_tab_columns where table_name = upper('api_info') and column_name = upper('urlpattern') and nullable = upper('Y');
  if (isexist = 0) then
    execute immediate 'alter table api_info modify urlpattern null';
  end if;
  end;
end;
-- end;
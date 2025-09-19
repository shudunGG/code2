-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- frame_user表row_id字段为空

begin
  declare isexist number;
  begin
  select count(1) into isexist  from user_tab_columns where table_name = upper('frame_user') and column_name = upper('row_id') and nullable = upper('Y');
  if (isexist = 0) then
    execute immediate 'alter table frame_user modify row_id null';
  end if;
  end;
end;
-- end;
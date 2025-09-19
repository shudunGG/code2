-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
 select count(1) into isexist from user_tab_columns where table_name = upper('api_document') and column_name = upper('outline');
  if (isexist = 0) then
    execute immediate 'alter table api_document add  outline nvarchar2(1000)';
  end if;
commit;
  
  end;
end;
/* GO */


-- end;
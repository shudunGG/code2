-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/4/18
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('framemj');
  if (isexist = 0) then
    execute immediate 'alter table frame_user add framemj integer default 0';
  end if;
  end;
end;
/* GO */

-- end;



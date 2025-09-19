-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/07/03
 begin
  declare isexist number;
  begin
   select count(1) into isexist from user_tab_columns where table_name = upper('messages_rule') and column_name = upper('contentlegth');
  if (isexist = 1) then
    execute immediate 'alter table messages_rule rename column contentlegth to contentlength';
  end if;
  end;
end;
/* GO */

 
-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/09/02
-- epointsform_designtemp表添加idsremark
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_designtemp') and column_name = upper('idsremark');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_designtemp add idsremark CLOB';
  end if;
  end;
end;
/* GO */

 
-- end;



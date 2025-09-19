-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/4/13
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center_histroy') and column_name = upper('tagname');
  if (isexist = 0) then
    execute immediate 'alter table messages_center_histroy add tagname nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center') and column_name = upper('tagname');
  if (isexist = 0) then
    execute immediate 'alter table messages_center add tagname nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



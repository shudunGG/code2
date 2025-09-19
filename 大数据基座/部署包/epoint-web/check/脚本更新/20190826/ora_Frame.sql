-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/8/26


-- 表单版本表epointformversion字段改为50长度 --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('Version') and data_length='100';
  if (isexist = 1) then
    execute immediate 'alter table epointformversion modify Version nvarchar2(50)';
  end if;
  end;
end;
/* GO */



--列表版本表epointsformlistversion字段改为50长度 --薛炳

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformlistversion') and column_name = upper('Version') and data_length='100';
  if (isexist = 1) then
    execute immediate 'alter table epointsformlistversion modify Version nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



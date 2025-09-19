-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 


-- 删除表EpointsformTemplate字段 --【薛炳】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate') and column_name = upper('accordionaddurl');
  if (isexist = 1) then
    execute immediate 'alter table EpointsformTemplate drop column accordionaddurl';
  end if;
  end;
end;
/* GO */
  
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate') and column_name = upper('accordionwfurl');
  if (isexist = 1) then
    execute immediate 'alter table EpointsformTemplate drop column accordionwfurl';
  end if;
  end;
end;
/* GO */
  
  
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate') and column_name = upper('accordiondetailurl');
  if (isexist = 1) then
    execute immediate 'alter table EpointsformTemplate drop column accordiondetailurl';
  end if;
  end;
end;
/* GO */
  
  
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate') and column_name = upper('accordionprinturl');
  if (isexist = 1) then
    execute immediate 'alter table EpointsformTemplate drop column accordionprinturl';
  end if;
  end;
end;
/* GO */

-- end;



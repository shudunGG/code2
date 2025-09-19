-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/06/24 
-- workflow_pvi表添加baseouguid --季海英
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_pvi') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_pvi add baseouguid nvarchar2(100)';
  end if;
  end;
end;

-- end;

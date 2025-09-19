-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/05/16
-- 修改workflow_workitem_history中ACTIVITYNAME字段长度 -- cdy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_workitem_history') and column_name = upper('ACTIVITYNAME') data_length='500';
  if (isexist = 0) then
    execute immediate 'alter table workflow_workitem_history modify ACTIVITYNAME nvarchar2(250)';
  end if;
  end;
end;
/* GO */
--end;
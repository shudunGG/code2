-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/08/29 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加备注字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_transition_condition') and column_name = upper('remark');
  if (isexist = 0) then
    execute immediate 'alter table workflow_transition_condition add remark  nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- end;



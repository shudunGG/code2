-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/20
-- WorkflowProcess表新增自定义流程类型字段customType --季立霞

-- 添加字段customType
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_process') and column_name = upper('customtype');
  if (isexist = 0) then
    execute immediate 'alter table workflow_process add customtype  int';
  end if;
  end;
end;
/* GO */


-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/1/15
-- workflow_transition表IS_SHOWOVERTIMEPOINT字段改为int类型 -- 徐剑

-- 修改字段示例（类型不一致）
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_transition') and column_name = upper('IS_SHOWOVERTIMEPOINT');
  if (isexist > 0) then
     execute immediate 'alter table workflow_transition add newcolumn integer';
    execute immediate 'update workflow_transition set newcolumn = IS_SHOWOVERTIMEPOINT';
    execute immediate 'alter table workflow_transition drop column IS_SHOWOVERTIMEPOINT';
    execute immediate 'alter table workflow_transition rename column newColumn to IS_SHOWOVERTIMEPOINT';
  end if;
  end;
end;


/* GO */

-- end;



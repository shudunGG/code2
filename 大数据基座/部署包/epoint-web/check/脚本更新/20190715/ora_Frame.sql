-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/09【时间】
-- app_info表添加issyncworkflow字段-- 季立霞

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('issyncworkflow');
  if (isexist = 0) then
    execute immediate 'alter table app_info add issyncworkflow  Integer default 0';
  end if;
  end;
end;
/* GO */

-- end;



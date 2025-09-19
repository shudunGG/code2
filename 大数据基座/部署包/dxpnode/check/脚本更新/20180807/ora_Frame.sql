-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/07
-- app_role_relation添加字段allowtype -- 周志豪

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_role_relation') and column_name = upper('allowtype');
  if (isexist = 0) then
    execute immediate 'alter table app_role_relation add allowtype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/07/19
-- api_runtime_log添加useragent字段 --周志豪

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log') and column_name = upper('useragent');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_log add useragent  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- end;



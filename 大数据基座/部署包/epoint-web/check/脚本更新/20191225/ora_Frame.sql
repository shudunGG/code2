-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/10/24
-- 【datasource添加字段smartbisid，同步SmartBI数据源，用于存sid】 --【季海英】

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('smartbisid');
  if (isexist = 0) then
    execute immediate 'alter table datasource add smartbisid  nvarchar2(100)';
  end if;
  end;
end;


-- end;



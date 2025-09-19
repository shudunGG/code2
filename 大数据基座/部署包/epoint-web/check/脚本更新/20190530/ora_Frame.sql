-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/5/20
-- code_main添加baseouguid字段 --【何晓瑜】

-- code_main添加baseouguid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('code_main') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table code_main add baseouguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- end;



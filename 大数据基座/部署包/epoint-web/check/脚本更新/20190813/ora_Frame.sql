-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/08/13
-- datasource数据源表添加conntype字段 --孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('conntype');
  if (isexist = 0) then
    execute immediate 'alter table datasource add conntype nvarchar2(10)';
  end if;
  end;
end;
/* GO */


-- end;



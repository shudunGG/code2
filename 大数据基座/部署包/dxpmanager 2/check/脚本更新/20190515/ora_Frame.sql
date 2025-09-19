-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/05/15
-- 修改api_info中apirealurl字段长度 -- cdy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('apirealurl') and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
    execute immediate 'alter table api_info modify apirealurl nvarchar2(200)';
  end if;
  end;
end;
/* GO */
--end;
-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/19
-- 修改字段querytext的长度 --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_searchareaconfig') and column_name = upper('querytext') and data_length='200';
  if (isexist = 0) then
    execute immediate 'alter table tablelist_searchareaconfig modify querytext nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/05/21 
-- 修改表字段长度
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('code_items') and column_name = upper('itemtext') 
  and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table code_items add newcolumn nvarchar2(2000)';
    execute immediate 'update code_items set newcolumn = itemtext';
    execute immediate 'alter table code_items drop column itemtext';
    execute immediate 'alter table code_items rename column newColumn to itemtext';
  end if;
  end;
end;
/* GO */

-- end;



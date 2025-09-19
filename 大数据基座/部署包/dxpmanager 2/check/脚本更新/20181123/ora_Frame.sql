-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- app_info表新增字段issyncmessage --徐剑

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('issyncmessage');
  if (isexist = 0) then
    execute immediate 'alter table app_info add issyncmessage int';
  end if;
  end;
end;
/* GO */

-- end;



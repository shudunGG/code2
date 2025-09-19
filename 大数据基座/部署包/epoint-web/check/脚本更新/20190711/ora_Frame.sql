-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/7/11
-- sso_token_info添加platform，用于鉴别是否是移动端 --【wy】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('sso_token_info') and column_name = upper('platform');
  if (isexist = 0) then
    execute immediate 'alter table sso_token_info add platform  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
-- end;



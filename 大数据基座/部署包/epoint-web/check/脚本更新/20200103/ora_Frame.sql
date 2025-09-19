-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/2/6 补充
-- 修改APPROOTURL字段长度示例
-- app_info表的字符集utf8mb4，限制了总表的varchar字段的总长度，导致appsecret的长度无法被修改。
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('APPROOTURL') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 1) then
    execute immediate 'alter table app_info modify APPROOTURL nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- 2020/01/03 
-- 修改appsecret字段长度示例
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('appsecret') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 1) then
    execute immediate 'alter table app_info modify appsecret nvarchar2(500)';
  end if;
  end;
end;
/* GO */


-- end;



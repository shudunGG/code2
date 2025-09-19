-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/06 【时间】
-- app_info表添加issyncrole,issyncaddress字段 -- 樊志君

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('issyncrole');
  if (isexist = 0) then
    execute immediate 'alter table app_info add issyncrole  Integer default 0';
  end if;

  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('issyncaddress');
  if (isexist = 0) then
    execute immediate 'alter table app_info add issyncaddress  Integer default 0';
  end if;
  end;
end;
/* GO */

-- end;



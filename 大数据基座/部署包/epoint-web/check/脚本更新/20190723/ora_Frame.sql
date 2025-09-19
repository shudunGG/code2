-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/23【时间】
-- datasource表修改loginuser字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('loginuser') and data_type='NVARCHAR2' and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table datasource modify loginuser nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- datasource表修改loginpwd字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('loginpwd') and data_type='NVARCHAR2' and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table datasource modify loginpwd nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- datasource表修改servername字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('servername') and data_type='NVARCHAR2' and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table datasource modify servername nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- datasource表修改dbname字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('dbname') and data_type='NVARCHAR2' and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table datasource modify dbname nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- datasource表修改connectionstring字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('connectionstring') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
    execute immediate 'alter table datasource modify connectionstring nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- end;



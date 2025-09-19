-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/14
-- app_info表修改callbackurl字段长度 --周志豪

-- 修改字段长度示例
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('callbackurl') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table app_info add newcolumn NVARCHAR2(2000)';
    execute immediate 'update app_info set newcolumn = callbackurl';
    execute immediate 'alter table app_info drop column callbackurl';
    execute immediate 'alter table app_info rename column newColumn to callbackurl';
  end if;
  end;
end;

/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('scope') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table app_info add newcolumn NVARCHAR2(500)';
    execute immediate 'update app_info set newcolumn = scope';
    execute immediate 'alter table app_info drop column scope';
    execute immediate 'alter table app_info rename column newColumn to scope';
  end if;
  end;
end;

/* GO */

-- app_info表添加字段 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('verificationtype');
  if (isexist = 0) then
    execute immediate 'alter table app_info add verificationtype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('serverurl');
  if (isexist = 0) then
    execute immediate 'alter table app_info add serverurl  nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('serverintraneturl');
  if (isexist = 0) then
    execute immediate 'alter table app_info add serverintraneturl  nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('redirectintraneturl');
  if (isexist = 0) then
    execute immediate 'alter table app_info add redirectintraneturl  nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('display');
  if (isexist = 0) then
    execute immediate 'alter table app_info add display  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('ssoenabled');
  if (isexist = 0) then
    execute immediate 'alter table app_info add ssoenabled  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('intefaceproject');
  if (isexist = 0) then
    execute immediate 'alter table app_info add intefaceproject  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



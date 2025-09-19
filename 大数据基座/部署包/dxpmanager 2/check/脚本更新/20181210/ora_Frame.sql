-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('appguid');
  if (isexist = 1) then
    execute immediate 'alter table api_subscribe modify appguid nvarchar2(200)';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('apiguid');
  if (isexist = 1) then
    execute immediate 'alter table api_subscribe modify apiguid nvarchar2(200)';
  end if;
  
 select count(1) into isexist from user_tab_columns where table_name = upper('api_request_params') and column_name = upper('example');
  if (isexist = 0) then
    execute immediate 'alter table api_request_params add  example nvarchar2(100)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('apiname');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  apiname nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('appname');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  appname nvarchar2(50)';
  end if;
commit;
  
  end;
end;
/* GO */


-- end;
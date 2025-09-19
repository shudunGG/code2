-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('iconurl');
  if (isexist = 0) then
    execute immediate 'alter table api_info add  iconurl nvarchar2(200)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('applystatus');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  applystatus integer';
  end if;

  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('applyuser');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  applyuser nvarchar2(50)';
  end if;

  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('applyusername');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  applyusername nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('mobilephone');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  mobilephone nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('applyreason');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  applyreason clob';
  end if;
    
  select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('refusereason');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  refusereason nvarchar2(500)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('api_subscribe') and column_name = upper('commitdate');
  if (isexist = 0) then
    execute immediate 'alter table api_subscribe add  commitdate date';
  end if;
commit;
  
  end;
end;
/* GO */


-- end;
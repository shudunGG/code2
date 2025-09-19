-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/9/29 
-- 【api_channel_upstream中添加pingurl字段】 --【cdy】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('pingurl');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add pingurl  nvarchar2(200)';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('httptype');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add httptype  nvarchar2(200)';
  end if;
     select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('httpcode');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add httpcode  nvarchar2(200)';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('rise');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add rise  Integer';
  end if;
     select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('failcount');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add failcount  Integer';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('connectTimeout');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add connectTimeout  Integer';
  end if;
   select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('readTimeout');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add readTimeout  Integer';
  end if;
  end;
end;
/* GO */


-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/16【时间】
-- frame_config表增加manageindependent-- 何晓瑜
-- messages_channel表增加extendattr,extendconfigpage字段 -- 何晓瑜
-- messages_message和messages_messagehistory表增加mobilelinkurl字段 -- 何晓瑜

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_config') and column_name = upper('manageindependent');
  if (isexist = 0) then
    execute immediate 'alter table frame_config add manageindependent Integer default 0';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_channel') and column_name = upper('extendattr');
  if (isexist = 0) then
    execute immediate 'alter table messages_channel add extendattr nvarchar2(2000)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_channel') and column_name = upper('extendconfigpage');
  if (isexist = 0) then
    execute immediate 'alter table messages_channel add extendconfigpage nvarchar2(1000)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('mobilelinkurl');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add mobilelinkurl nvarchar2(2000)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('mobilelinkurl');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add mobilelinkurl nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- end;



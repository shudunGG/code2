-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/05/09 【时间】
-- 【消息历史表】 --【何晓瑜】

-- 消息对应业务系统的标识4
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('clientidentifier4');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add clientidentifier4  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 消息对应业务系统的标识5
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('clientidentifier5');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add clientidentifier5  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 消息对应业务系统的标识6
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('clientidentifier6');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add clientidentifier6  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 是否忽略
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('isnoneedremind');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add isnoneedremind  integer';
  end if;
  end;
end;
/* GO */

-- 是否置顶
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('istop');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add istop  integer';
  end if;
  end;
end;
/* GO */
-- end;



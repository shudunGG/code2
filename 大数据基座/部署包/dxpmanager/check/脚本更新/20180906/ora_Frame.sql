-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/06
-- 消息表增加一个移动端是否需要提醒字段  --何晓瑜

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_message') and column_name = upper('isnoneedmobileremind');
  if (isexist = 0) then
    execute immediate 'alter table messages_message add  isnoneedmobileremind integer';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_messagehistory') and column_name = upper('isnoneedmobileremind');
  if (isexist = 0) then
    execute immediate 'alter table messages_messagehistory add  isnoneedmobileremind integer';
  end if;

    
commit;
  
  end;
end;
/* GO */
  

-- end;
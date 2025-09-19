-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/17
-- 添加消息类型字段 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_type') and column_name = upper('opentype');
  if (isexist = 0) then
    execute immediate 'alter table messages_type add opentype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 消息订阅表
-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Message_subscribe');
 if (isexist = 0) then
    execute immediate '
      create table Message_subscribe
             (
               rowguid               nvarchar2(50) not null primary key,
               appguid               nvarchar2(50),
  			   subscribeguid         nvarchar2(50),
               subscribetype         nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;



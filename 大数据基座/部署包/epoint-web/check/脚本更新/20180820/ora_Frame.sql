-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/06/29
-- messages_waitsend增加字段,解决带发表消息无法收回的问题--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier  nvarchar2(200)';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier2');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier2 nvarchar2(200)';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier3');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier3 nvarchar2(200)';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier4');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier4 nvarchar2(200)';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier5');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier5 nvarchar2(200)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('clientidentifier6');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add clientidentifier6 nvarchar2(200)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('typeguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add typeguid nvarchar2(50)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('appkey');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add appkey nvarchar2(50)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('targetuserid');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add targetuserid nvarchar2(50)';
  end if;
  end;
end;
/* GO */
-- end;



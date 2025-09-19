-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
 select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('messagesmessageguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add  messagesmessageguid nvarchar2(50)';
  end if;
commit;
select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('channelguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add  channelguid nvarchar2(50)';
  end if;
commit;
 select count(1) into isexist from user_tab_columns where table_name = upper('messages_waitsend') and column_name = upper('waitsendtype');
  if (isexist = 0) then
    execute immediate 'alter table messages_waitsend add  waitsendtype nvarchar2(50)';
  end if;
commit;
 select count(1) into isexist from user_tab_columns where table_name = upper('messages_log') and column_name = upper('messagesmessageguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_log add  messagesmessageguid nvarchar2(50)';
  end if;
commit;
  end;
end;
/* GO */


-- end;
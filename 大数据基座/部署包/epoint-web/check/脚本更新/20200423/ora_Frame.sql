-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- COMM_MESSAGE_REMIND_INFO表targetusername，targetuserguid字段改为Text

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('COMM_MESSAGE_REMIND_INFO') and column_name = upper('targetuserguid') and data_type=upper('clob');
  if (isexist = 0) then
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO add newcolumn clob';
    execute immediate 'update COMM_MESSAGE_REMIND_INFO set newcolumn = targetuserguid';
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO drop column targetuserguid';
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO rename column newColumn to targetuserguid';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('COMM_MESSAGE_REMIND_INFO') and column_name = upper('targetusername') and data_type=upper('clob');
  if (isexist = 0) then
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO add newcolumn clob';
    execute immediate 'update COMM_MESSAGE_REMIND_INFO set newcolumn = targetusername';
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO drop column targetusername';
    execute immediate 'alter table COMM_MESSAGE_REMIND_INFO rename column newColumn to targetusername';
  end if;
  end;
end;
/* GO */

-- end;

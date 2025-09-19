-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/05/09【时间】
-- 表api_runtime_alert_rule添加字段ruletype  api_runtime_alert_info表
-- api_runtime_handle_rule表添加

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_rule') and column_name = upper('ruletype');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_rule add ruletype nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_rule') and column_name = upper('handleruleguid');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_rule add handleruleguid nvarchar2(50)';
  end if;

  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alertresult');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add  alertresult nvarchar2(2000)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alertsolution');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add  alertsolution clob';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('time');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info rename column time to recordtime';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('decription');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info rename column decription to alertdecription';
  end if;
  
     select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('messagetype');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info drop column messagetype';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alerttype');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info drop column alerttype';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('subjectguid');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add subjectguid nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('monitoringvalue');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add monitoringvalue nvarchar2(50)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('ruleid');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add ruleid nvarchar2(50)';
  end if;
  
  end;
end;
/* GO */



begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_handle_rule');
  if (isexist = 0) then
    execute immediate '
      create table api_runtime_handle_rule
             (
                 rowguid   nvarchar2(50) not null primary key,
                 rulename        nvarchar2(100) not null,
                 ruleID         nvarchar2(100)  not null,
                 handletype     number,
                 enabled    nvarchar2(11)
              )';
  end if;
  end;
end;
/* GO */



-- end;



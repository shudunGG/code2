-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/10
-- 新增表api_runtime_alert_ops_log --【俞俊男】
-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype --【俞俊男】
-- 表api_runtime_alert_rule添加字段alertruletype --【俞俊男】

-- 添加表api_runtime_alert_ops_log
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_ops_log');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_alert_ops_log
             (
               rowguid nvarchar2(50) not null primary key,
               fromip nvarchar2(50),
			   userguid nvarchar2(50),
			   operatortype nvarchar2(50),
			   operatecontent nvarchar2(2000),
			   displayname nvarchar2(50),
			   operatetime date,
			   ruleGuid nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */


-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('messagetype');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add messagetype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('metric');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add metric  nvarchar2(100)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('rulename');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add rulename  nvarchar2(100)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alerttype');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add alerttype  nvarchar2(500)';
  end if;
  end;
end;
/* GO */


-- 表api_runtime_alert_rule添加字段alertruletype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_rule') and column_name = upper('alertruletype');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_rule add alertruletype  int';
  end if;
  end;
end;
/* GO */
-- end;



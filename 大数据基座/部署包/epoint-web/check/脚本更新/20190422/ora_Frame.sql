-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/04/22【时间】
-- 添加表 api_runtime_property、api_runtime_log_byday、statistics_history_log、statistics_streaming、statistics_today --【俞俊男】
-- 修改表 api_runtime_alert_info，添加字段 alert_result、alert_solution，修改字段time改为record_time、decription改为description --【俞俊男】


-- 添加表 api_runtime_property
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_property');
 if (isexist = 0) then
    execute immediate 
      'create table api_runtime_property
             (
               rowguid	nvarchar2(50) not null primary key,
               property_type nvarchar2(255),
			   property_value NUMBER
              )';
  end if;
  end;
end;
/* GO */

-- 添加表 api_runtime_log_byday
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log_byday');
 if (isexist = 0) then
    execute immediate 
      'create table api_runtime_log_byday
             (
				rowguid	nvarchar2(50) not null primary key,
				record_time	date,
				api_total_count NUMBER(20,0),
				requestsize_total NUMBER,
				responsesize_total NUMBER,
				request_failed_count NUMBER(20,0),
				requesttime_average NUMBER
              )';
  end if;
  end;
end;
/* GO */

-- 添加表 statistics_history_log
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('statistics_history_log');
 if (isexist = 0) then
    execute immediate 
      'create table statistics_history_log
             (
				rowguid	nvarchar2(50) not null primary key,
				record_time	date,
				alert_total_count NUMBER(20,0),
				api_total_count NUMBER(20,0)
              )';
  end if;
  end;
end;
/* GO */

-- 添加表 statistics_streaming
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('statistics_streaming');
 if (isexist = 0) then
    execute immediate 
      'create table statistics_streaming
             (
				rowguid	nvarchar2(50) not null primary key,
				record_time	date,
				api_total_count NUMBER(20,0),
				requestsize_bps NUMBER(30, 10),
				responsesize_bps NUMBER,
				requesttime_average NUMBER(30, 10),
				request_success_rate NUMBER(11, 10),
				requestsize_max NUMBER(30, 10),
				responsesize_max NUMBER(30, 10)
              )';
  end if;
  end;
end;
/* GO */

-- 添加表 statistics_today
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('statistics_today');
 if (isexist = 0) then
    execute immediate 
      'create table statistics_today
             (
				rowguid	nvarchar2(50) not null primary key,
				record_time	date,
				api_total_count NUMBER(20,0),
				request_success_rate NUMBER(11, 10),
				requestsize_max NUMBER(30, 10),
				responsesize_max NUMBER(30, 10)
              )';
  end if;
  end;
end;
/* GO */

-- api_runtime_alert_info表 添加字段 alert_result、alert_solution
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alert_result');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add alert_result  nvarchar2(500)';
  end if;
  end;
end;
/* GO */ 
begin
  declare isexist number; 
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('alert_solution');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_alert_info add alert_solution  nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- api_runtime_alert_info表 修改字段 time改为record_time、decription改为description
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('time');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info rename column time to record_time';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;  
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info') and column_name = upper('decription');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_info rename column decription to description';
  end if;
  end;
end;
/* GO */

-- end;



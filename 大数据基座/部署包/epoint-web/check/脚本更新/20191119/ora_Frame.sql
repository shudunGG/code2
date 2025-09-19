-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/11/19 【时间】
-- 添加表 api_runtime_statistics_apiday、api_runtime_log_statistics、api_runtime_statistics_csmday、api_runtime_statistics_apimin和api_runtime_statistics_csmmin  --【俞俊男】

-- 添加api_runtime_log_statistics表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log_statistics');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_log_statistics
             (
               rowguid  nvarchar2(50) not null primary key,
               magnitude int,
			   apiguid  nvarchar2(50),
			   consumer  nvarchar2(50),
               status_2XX  NUMBER(20,0),
			   errorstatus_4XX  NUMBER(20,0),
			   errorstatus_5XX  NUMBER(20,0),
               request_traffic  NUMBER,
			   response_traffic NUMBER,
			   response_time NUMBER,
			   api_total_count NUMBER(20,0),
               record_time  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加api_runtime_statistics_apiday表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_apiday');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_apiday
             (
               rowguid  nvarchar2(50) not null primary key,
               apiguid  nvarchar2(50),
               status_2XX  NUMBER(20,0),
			   errorstatus_4XX  NUMBER(20,0),
			   errorstatus_5XX  NUMBER(20,0),
               request_traffic  NUMBER,
			   request_bandwidth NUMBER,
			   response_traffic NUMBER,
			   response_bandwidth NUMBER,
			   response_time NUMBER,
			   api_total_count NUMBER(20,0),
               record_time  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加api_runtime_statistics_csmday表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_csmday');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_csmday
             (
               rowguid  nvarchar2(50) not null primary key,
               consumer  nvarchar2(50),
               status_2XX  NUMBER(20,0),
			   errorstatus_4XX  NUMBER(20,0),
			   errorstatus_5XX  NUMBER(20,0),
               request_traffic  NUMBER,
			   request_bandwidth NUMBER,
			   response_traffic NUMBER,
			   response_bandwidth NUMBER,
			   response_time NUMBER,
			   api_total_count NUMBER(20,0),
               record_time  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加api_runtime_statistics_apimin表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_apimin');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_apimin
             (
               rowguid  nvarchar2(50) not null primary key,
               apiguid  nvarchar2(50),
               status_2XX  NUMBER(20,0),
			   errorstatus_4XX  NUMBER(20,0),
			   errorstatus_5XX  NUMBER(20,0),
               request_traffic  NUMBER,
			   request_bandwidth NUMBER,
			   response_traffic NUMBER,
			   response_bandwidth NUMBER,
			   response_time NUMBER,
			   api_total_count NUMBER(20,0),
               record_time  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加api_runtime_statistics_csmmin表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_csmmin');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_csmmin
             (
               rowguid  nvarchar2(50) not null primary key,
               consumer  nvarchar2(50),
               status_2XX  NUMBER(20,0),
			   errorstatus_4XX  NUMBER(20,0),
			   errorstatus_5XX  NUMBER(20,0),
               request_traffic  NUMBER,
			   request_bandwidth NUMBER,
			   response_traffic NUMBER,
			   response_bandwidth NUMBER,
			   response_time NUMBER,
			   api_total_count NUMBER(20,0),
               record_time  date
              )';
  end if;
  end;
end;
/* GO */

-- end;



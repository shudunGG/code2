-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/09/11 【时间】
-- 添加表api_runtime_statistics_apiday、api_runtime_statistics_consumerday、api_runtime_log_statistics --【俞俊男】

-- 添加api_runtime_statistics_apiday表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_apiday'))
create table api_runtime_statistics_apiday
   (
               rowguid  nvarchar(50) not null primary key,
               apiguid  nvarchar(50),
               status_2XX bigint,
			   errorstatus_4XX bigint,
			   errorstatus_5XX bigint,
			   request_traffic float,
			   request_bandwidth float,
			   response_traffic float,
			   response_bandwidth float,
			   response_time float,
			   api_total_count bigint,
               record_time  datetime
    );
GO

-- 添加api_runtime_statistics_consumerday表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_consumerday'))
create table api_runtime_statistics_consumerday
   (
               rowguid  nvarchar(50) not null primary key,
               consumer  nvarchar(50),
               status_2XX bigint,
			   errorstatus_4XX bigint,
			   errorstatus_5XX bigint,
			   request_traffic float,
			   request_bandwidth float,
			   response_traffic float,
			   response_bandwidth float,
			   response_time float,
			   api_total_count bigint,
               record_time  datetime
    );
GO

-- 添加api_runtime_log_statistics表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_log_statistics'))
create table api_runtime_log_statistics
   (
               rowguid  nvarchar(50) not null primary key,
			   magnitude int,
			   apiguid nvarchar(50),
               consumer  nvarchar(50),
               status_2XX bigint,
			   errorstatus_4XX bigint,
			   errorstatus_5XX bigint,
			   request_traffic float,
			   response_traffic float,
			   response_time float,
			   api_total_count bigint,
               record_time  datetime
    );
GO
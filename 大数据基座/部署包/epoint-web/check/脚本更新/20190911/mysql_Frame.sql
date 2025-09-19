-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/09/11 【时间】
-- 添加表api_runtime_statistics_apiday、api_runtime_statistics_consumerday、api_runtime_log_statistics --【俞俊男】

-- 添加api_runtime_statistics_apiday表
create table if not exists api_runtime_statistics_apiday
(
  rowguid  nvarchar(50) not null primary key,
  apiguid  nvarchar(50),
  status_2XX bigint(50),
  errorstatus_4XX bigint(50),
  errorstatus_5XX bigint(50),
  request_traffic double(18,2),
  request_bandwidth double(18,2),
  response_traffic double(18,2),
  response_bandwidth double(18,2),
  response_time double(10,5),
  api_total_count bigint(12),
  record_time datetime
);
GO


-- 添加api_runtime_statistics_consumerday表
create table if not exists api_runtime_statistics_consumerday
(
  rowguid  nvarchar(50) not null primary key,
  consumer  nvarchar(50),
  status_2XX bigint(50),
  errorstatus_4XX bigint(50),
  errorstatus_5XX bigint(50),
  request_traffic double(255,10),
  request_bandwidth double(255,10),
  response_traffic double(255,10),
  response_bandwidth double(255,10),
  response_time double(10,5),
  api_total_count bigint(12),
  record_time datetime
);
GO


-- 添加api_runtime_log_statistics表
create table if not exists api_runtime_log_statistics
(
  rowguid  nvarchar(50) not null primary key,
  magnitude int(5),
  apiguid varchar(50),
  consumer varchar(50),
  status_2XX bigint(50),
  errorstatus_4XX bigint(50),
  errorstatus_5XX bigint(50),
  request_traffic double(50,2),
  response_traffic double(50,2),
  response_time double(10,5),
  api_total_count bigint(12),
  record_time datetime DEFAULT NULL,
  UNIQUE KEY apiguid (apiguid),
  UNIQUE KEY consumer (consumer)
);
GO

-- DELIMITER ; --
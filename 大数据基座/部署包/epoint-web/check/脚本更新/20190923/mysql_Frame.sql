-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/09/23 【时间】
-- 添加表api_runtime_statistics_apimin、api_runtime_statistics_csmmin --【俞俊男】

-- 添加api_runtime_statistics_apimin表
create table if not exists api_runtime_statistics_apimin
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


-- 添加api_runtime_statistics_csmmin表
create table if not exists api_runtime_statistics_csmmin
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


-- DELIMITER ; --
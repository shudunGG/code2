-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/04/22【时间】
-- 添加表 api_runtime_property、api_runtime_log_byday、statistics_history_log、statistics_streaming、statistics_today --【俞俊男】



-- 添加表 api_runtime_property
create table if not exists api_runtime_property
(
  rowguid	nvarchar(50) not null primary key,
  property_type nvarchar(255),
  property_value double(255, 10)
);
GO

-- 添加表 api_runtime_log_byday
create table if not exists api_runtime_log_byday
(
  rowguid	nvarchar(50) not null primary key,
  record_time	datetime,
  api_total_count bigint,
  requestsize_total double(255, 10),
  responsesize_total double(255, 10),
  request_failed_count bigint,
  requesttime_average double(255, 10)
);
GO

-- 添加表 statistics_history_log
create table if not exists statistics_history_log
(
  rowguid	nvarchar(50) not null primary key,
  record_time	datetime,
  alert_total_count bigint,
  api_total_count bigint
);
GO

-- 添加表 statistics_streaming
create table if not exists statistics_streaming
(
  rowguid	nvarchar(50) not null primary key,
  record_time	datetime,
  api_total_count bigint,
  requestsize_bps double(30, 10),
  responsesize_bps double(255, 10),
  requesttime_average double(30, 10),
  request_success_rate double(11, 10),
  requestsize_max double(30, 10),
  responsesize_max double(30, 10)
);
GO

-- 添加表 statistics_today
create table if not exists statistics_today
(
  rowguid	nvarchar(50) not null primary key,
  record_time	datetime,
  api_total_count bigint,
  request_success_rate double(11, 10),
  requestsize_max double(30, 10),
  responsesize_max double(30, 10)
);
GO

-- DELIMITER ; --
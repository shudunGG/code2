-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/04/22【时间】
-- 添加表 api_runtime_property、api_runtime_log_byday、statistics_history_log、statistics_streaming、statistics_today --【俞俊男】
-- 修改表 api_runtime_alert_info，添加字段 alert_result、alert_solution，修改字段time改为record_time、decription改为description --【俞俊男】


-- 添加表 api_runtime_property
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_property'))
create table api_runtime_property
   (
		rowguid	nvarchar(50) not null primary key,
		property_type nvarchar(255),
		property_value float
    );
GO

-- 添加表 api_runtime_log_byday
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_log_byday'))
create table api_runtime_log_byday
   (
		rowguid	nvarchar(50) not null primary key,
		record_time	datetime,
		api_total_count bigint,
		requestsize_total float,
		responsesize_total float,
		request_failed_count bigint,
		requesttime_average float
    );
GO

-- 添加表 statistics_history_log
if not exists (select * from dbo.sysobjects where id = object_id('statistics_history_log'))
create table statistics_history_log
   (
		rowguid	nvarchar(50) not null primary key,
		record_time	datetime,
		alert_total_count bigint,
		api_total_count bigint
    );
GO

-- 添加表 statistics_streaming
if not exists (select * from dbo.sysobjects where id = object_id('statistics_streaming'))
create table statistics_streaming
   (
		rowguid	nvarchar(50) not null primary key,
		record_time	datetime,
		api_total_count bigint,
		requestsize_bps float(53),
		responsesize_bps float,
		requesttime_average float(53),
		request_success_rate real,
		requestsize_max float(53),
		responsesize_max float(53)
    );
GO

-- 添加表 statistics_today
if not exists (select * from dbo.sysobjects where id = object_id('statistics_today'))
create table statistics_today
   (
		rowguid	nvarchar(50) not null primary key,
		record_time	datetime,
		api_total_count bigint,
		request_success_rate real,
		requestsize_max float(53),
		responsesize_max float(53)
    );
GO

-- api_runtime_alert_info表 添加字段 alert_result、alert_solution
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alert_result' ) 
alter table api_runtime_alert_info add alert_result  nvarchar(500); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alert_solution' ) 
alter table api_runtime_alert_info add alert_solution  nvarchar(500); 
GO

-- api_runtime_alert_info表 修改字段 time改为record_time、decription改为description
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='time' ) 
alter table api_runtime_alert_info add record_time datetime;  
else
exec sp_rename 'api_runtime_alert_info.time','record_time','column';  
GO
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='decription' ) 
alter table api_runtime_alert_info add description datetime;  
else
exec sp_rename 'api_runtime_alert_info.decription','description','column';  
GO
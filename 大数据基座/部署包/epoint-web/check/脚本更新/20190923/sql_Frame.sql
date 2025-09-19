-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/09/23 【时间】
-- 添加表api_runtime_statistics_apiminutes、api_runtime_statistics_consumerminutes --【俞俊男】

-- 添加api_runtime_statistics_apiminutes表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_apiminutes'))
create table api_runtime_statistics_apiminutes
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

-- 添加api_runtime_statistics_csmmin表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_csmmin'))
create table api_runtime_statistics_csmmin
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

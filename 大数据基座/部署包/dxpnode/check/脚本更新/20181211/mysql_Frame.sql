-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/12/12

-- 新增 API运行统计资源表 --周志豪
create table if not exists api_runtime_statistics_subject
(
  rowguid                nvarchar(50) not null primary key,
  resourcetype           nvarchar(50),
  updatetime 			 bigint,
  uuid					 nvarchar(500),
  displayname			 nvarchar(100),
  enabled 			     nvarchar(50),
  metric				 nvarchar(200)
);
GO
-- 新增API运行统计数据表 --周志豪
create table if not exists api_runtime_statistics_data
(
  rowguid                nvarchar(50) not null primary key,
  metric				 nvarchar(500),
  statisticsvalue		 nvarchar(1000),
  statisticstype 		 nvarchar(100),
  timescale				 nvarchar(50),
  statisticstime		 bigint,
  ordernumber			 int(11)
);	
GO
-- 新增开发者表 --周志豪
create table if not exists frame_developer
(
  rowguid                nvarchar(50) not null primary key,
  userguid				 nvarchar(100) not null,
  loginid		         nvarchar(100) not null,
  displayname		     nvarchar(100),
  password			     nvarchar(100) not null,
  mobile			     nvarchar(100) ,
  companyname			 nvarchar(500) 
);	 
GO

-- 添加字段jsoncontent
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'jsoncontent') then
    alter table api_info add column jsoncontent varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段responseTime 
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_log' and column_name = 'responsetime') then
    alter table api_runtime_log add column responsetime int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/4/24
-- 新增预警规则表 --周志豪

create table if not exists api_runtime_alert_rule (
  Rowguid varchar(50) NOT NULL PRIMARY KEY,
  subjects text,
  vdoing varchar(50),
  rulename varchar(100) ,
  metric varchar(100) ,
  watchtime int(11) ,
  watchvaluetype varchar(50) ,
  symbol varchar(50) ,
  thresholdvalue varchar(50) ,
  dumbperiod int(11) ,
  watchlength int(11) ,
  effectivetime varchar(100) ,
  messagetype varchar(50) ,
  targetusers text,
  alertlevel varchar(50) ,
  enabled varchar(50) ,
  latestpollingtime datetime 
);
GO


-- 新增预警展示表
create table if not exists api_runtime_alert_info (
	rowguid VARCHAR (50) NOT NULL PRIMARY KEY,
	ruleguid VARCHAR (50),
	subjecttype VARCHAR (100),
	subjectname VARCHAR (100),
	time datetime,
	decription text,
	messagetype VARCHAR (50),
	STATUS VARCHAR (50)
) ;
GO

-- DELIMITER ; --
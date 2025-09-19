-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/4/24
-- 预警规则表 --周志豪

if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_alert_rule'))
create table api_runtime_alert_rule (
  Rowguid varchar(50) not null primary key,
  subjects ntext,
  vdoing varchar(50),
  rulename varchar(100) ,
  metric varchar(100) ,
  watchtime integer ,
  watchvaluetype varchar(50) ,
  symbol varchar(50) ,
  thresholdvalue varchar(50) ,
  dumbperiod integer ,
  watchlength integer ,
  effectivetime varchar(100) ,
  messagetype varchar(50) ,
  targetusers ntext,
  alertlevel varchar(50) ,
  enabled varchar(50) ,
  latestpollingtime datetime 
);
GO

-- 预警展示表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_alert_info'))
create table api_runtime_alert_info (
  rowguid varchar(50) not null primary key,
  ruleguid varchar(50) ,
  subjecttype varchar(100),
  subjectname varchar(100),
  time datetime ,
  decription ntext,
  messagetype varchar(50) ,
  status varchar(50),
) ;
GO

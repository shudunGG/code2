-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/10
-- 新增表api_runtime_alert_ops_log --【俞俊男】
-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype --【俞俊男】
-- 表api_runtime_alert_rule添加字段alertruletype --【俞俊男】

-- 新增表api_runtime_alert_ops_log
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_alert_ops_log'))
create table api_runtime_alert_ops_log
   (
    rowguid     nvarchar(50) not null primary key,
    fromip     nvarchar(50),
	userguid     nvarchar(50),
	operatortype     nvarchar(50),
	operatecontent     nvarchar(2000),
	displayname     nvarchar(50),
	operatetime datetime,
	ruleGuid     nvarchar(50)
    );
GO


-- 表api_runtime_alert_info添加字段messagetype、metric、rulename和alerttype
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='messagetype' ) 
alter table api_runtime_alert_info add messagetype  nvarchar(50); 
GO
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='metric' ) 
alter table api_runtime_alert_info add metric  nvarchar(100); 
GO
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='rulename' ) 
alter table api_runtime_alert_info add rulename  nvarchar(100); 
GO
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alerttype' ) 
alter table api_runtime_alert_info add alerttype  nvarchar(500); 
GO

-- 表api_runtime_alert_rule添加字段alertruletype
if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_rule') and name='alertruletype' ) 
alter table api_runtime_alert_rule add alertruletype  int; 
GO
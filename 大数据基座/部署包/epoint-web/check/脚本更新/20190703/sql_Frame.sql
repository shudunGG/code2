-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/05【时间】
-- 添加api_runtime_handle_rule 表--【cdy】
-- api_runtime_alert_rule， api_runtime_alert_info 添加字段【cdy】


if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_rule') and name='ruletype' ) 
alter table api_runtime_alert_rule add ruletype nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_rule') and name='handleruleguid' ) 
alter table api_runtime_alert_rule add handleruleguid varchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='subjectguid' ) 
alter table api_runtime_alert_info add subjectguid nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='monitoringvalue' ) 
alter table api_runtime_alert_info add monitoringvalue nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='ruleid' ) 
alter table api_runtime_alert_info add ruleid nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alertsolution' ) 
alter table api_runtime_alert_info add alertsolution text; 
GO

if not exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alertresult' ) 
alter table api_runtime_alert_info add alertresult nvarchar(2000); 
GO


if  exists (select * from information_schema.columns  where  table_name = 'api_runtime_alert_info' and column_name='time') 
exec sp_rename 'api_runtime_alert_info.time','recordtime';
GO

if  exists (select * from information_schema.columns  where  table_name = 'api_runtime_alert_info' and column_name='decription') 
exec sp_rename 'api_runtime_alert_info.decription','alertdecription';
GO

if exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='messagetype') 
alter table api_runtime_alert_info drop COLUMN messagetype ; 
GO

if  exists (select name from syscolumns  where id = object_id('api_runtime_alert_info') and name='alerttype') 
alter table api_runtime_alert_info drop COLUMN alerttype ; 
GO

-- 添加处理规则表
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_handle_rule'))
create table api_runtime_handle_rule
   (
  rowguid        nvarchar(50) not null primary key,
  rulename          nvarchar(100) not null,
  ruleID            nvarchar(100) not null,
  handletype              int,
  enabled            nvarchar(11)
    );
GO
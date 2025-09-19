-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/21
if exists (SELECT * FROM sys.indexes   where  object_id = OBJECT_ID('api_subscribe')AND name = 'IDX_API_S_APIGUID_APPGUID')
begin
drop index IDX_API_S_APIGUID_APPGUID on api_subscribe
end
GO

if not exists (select * from information_schema.columns where table_name = 'api_subscribe' and column_name = 'appguid' and data_type='varchar' and character_maximum_length=200) 
alter table api_subscribe 
alter column appguid varchar(200); 
GO

if not exists (select * from information_schema.columns where table_name = 'api_subscribe' and column_name = 'apiguid' and data_type='varchar' and character_maximum_length=200) 
alter table api_subscribe 
alter column apiguid varchar(200); 
GO

if not exists (SELECT * FROM sys.indexes   where  object_id = OBJECT_ID('api_subscribe')AND name = 'IDX_API_S_APIGUID_APPGUID')
begin
create unique nonclustered index IDX_API_S_APIGUID_APPGUID on api_subscribe(appguid,apiguid)
end
GO

if not exists (select name from syscolumns  where id = object_id('api_request_params') and name='example' ) 
alter table api_request_params add example varchar(100);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='apiname' ) 
alter table api_subscribe add apiname varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='appname' ) 
alter table api_subscribe add appname varchar(50);
GO
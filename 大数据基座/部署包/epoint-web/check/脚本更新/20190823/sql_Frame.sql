-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/08/23【时间】
-- api_info表添加字段timeoutInMilliseconds、requestVolumeThreshold、errorThresholdPercentage、sleepWindowInMilliseconds、dataSourceId、operatetype、apidata --【俞俊男】

-- 添加字段timeoutInMilliseconds
if not exists (select name from syscolumns  where id = object_id('api_info') and name='timeoutInMilliseconds' ) 
alter table api_info add timeoutInMilliseconds  bigint; 
GO

-- 添加字段requestVolumeThreshold
if not exists (select name from syscolumns  where id = object_id('api_info') and name='requestVolumeThreshold' ) 
alter table api_info add requestVolumeThreshold  int; 
GO

-- 添加字段errorThresholdPercentage
if not exists (select name from syscolumns  where id = object_id('api_info') and name='errorThresholdPercentage' ) 
alter table api_info add errorThresholdPercentage  int; 
GO

-- 添加字段sleepWindowInMilliseconds
if not exists (select name from syscolumns  where id = object_id('api_info') and name='sleepWindowInMilliseconds' ) 
alter table api_info add sleepWindowInMilliseconds  bigint; 
GO

-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('api_info') and name='dataSourceId' ) 
alter table api_info add dataSourceId  int; 
GO

-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('api_info') and name='operatetype' ) 
alter table api_info add operatetype  nvarchar(50); 
GO

-- 添加字段apidata
if not exists (select name from syscolumns  where id = object_id('api_info') and name='apidata' ) 
alter table api_info add apidata  text; 
GO
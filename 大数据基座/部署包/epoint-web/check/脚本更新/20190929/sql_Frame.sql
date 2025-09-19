-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/9/29 
-- 【api_channel_upstream中添加pingurl字段】 --【cdy】

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='pingurl') 
alter table api_channel_upstream add pingurl  nvarchar(200); 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='httptype') 
alter table api_channel_upstream add httptype  nvarchar(200); 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='httpcode') 
alter table api_channel_upstream add httpcode  nvarchar(200); 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='rise') 
alter table api_channel_upstream add rise  int; 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='connectTimeout') 
alter table api_channel_upstream add connectTimeout  int; 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='failcount') 
alter table api_channel_upstream add failcount  int; 
GO
if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='readTimeout') 
alter table api_channel_upstream add readTimeout  int; 
GO


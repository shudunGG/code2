-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/7/25 【时间】
-- 【高可用通道】 --cdy

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('api_channel_upstream'))
create table api_channel_upstream
   (
   row_guid       nvarchar(50) not null primary key,
  order_number    int,
  upstream_name   nvarchar(100),
  upstream_encode_name   nvarchar(500),
  create_date     datetime,
  update_date     datetime
    );
GO


-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('api_channel_target'))
create table api_channel_target
   (
  row_guid    varchar(50) not null primary key,
  weight      int,
  target_host varchar(100),
  upstream_guid varchar(50),
  create_date     datetime,
  update_date     datetime
    );
GO

if not exists (select name from syscolumns  where id = object_id('api_channel_upstream') and name='upstreamid') 
alter table api_channel_upstream add upstreamid nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('api_channel_target') and name='targetid') 
alter table api_channel_target add targetid nvarchar(50); 
GO
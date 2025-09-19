-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/21

if not exists (select name from syscolumns  where id = object_id('api_info') and name='iconurl' ) 
alter table api_info add iconurl varchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='applystatus' ) 
alter table api_subscribe add applystatus int;
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='applyuser' ) 
alter table api_subscribe add applyuser varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='applyusername' ) 
alter table api_subscribe add applyusername varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='mobilephone' ) 
alter table api_subscribe add mobilephone varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='applyreason' ) 
alter table api_subscribe add applyreason text;
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='refusereason' ) 
alter table api_subscribe add refusereason varchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('api_subscribe') and name='commitdate' ) 
alter table api_subscribe add commitdate datetime;
GO
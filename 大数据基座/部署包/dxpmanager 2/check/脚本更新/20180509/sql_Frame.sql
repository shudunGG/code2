-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/05/09 【时间】
-- 【消息历史表】 --【何晓瑜】

-- 消息对应业务系统的标识4
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='clientidentifier4' ) 
alter table messages_messagehistory add clientidentifier4  nvarchar(200); 
GO

-- 消息对应业务系统的标识5
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='clientidentifier5' ) 
alter table messages_messagehistory add clientidentifier5  nvarchar(200); 
GO

-- 消息对应业务系统的标识6
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='clientidentifier6' ) 
alter table messages_messagehistory add clientidentifier6  nvarchar(200); 
GO

-- 是否忽略
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='isnoneedremind' ) 
alter table messages_messagehistory add isnoneedremind int; 
GO

-- 是否置顶
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='istop' ) 
alter table messages_messagehistory add istop  int; 
GO

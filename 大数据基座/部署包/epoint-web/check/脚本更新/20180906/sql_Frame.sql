-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/06
-- 消息表增加一个移动端是否需要提醒字段  --何晓瑜

if not exists (select name from syscolumns  where id = object_id('messages_message') and name='isnoneedmobileremind' ) 
alter table messages_message add isnoneedmobileremind int;
GO

if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='isnoneedmobileremind' ) 
alter table messages_messagehistory add isnoneedmobileremind int
GO




-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/5/29 
-- 新增字段用来 区分消息类型--【何晓瑜】
if not exists (select name from syscolumns  where id = object_id('messages_center') and name='messagesremindtype' ) 
alter table messages_center add messagesremindtype nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('messages_center_histroy') and name='messagesremindtype' ) 
 alter table messages_center_histroy add messagesremindtype nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('messages_type') and name='relatedfield' ) 
alter table messages_type add relatedfield nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('messages_type') and name='relatedvalue' ) 
alter table messages_type add relatedvalue nvarchar(50);
GO

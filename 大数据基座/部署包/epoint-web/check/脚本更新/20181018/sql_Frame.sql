-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/10/18 【时间】

-- 消息类型表增加字段 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_type') and name='updatemode' ) 
alter table messages_type add updatemode nvarchar(50);
GO
-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/03/07
-- 消息类型表大图标字段加大 --何晓瑜
if not exists (select * from information_schema.columns where  table_name = 'messages_type' and column_name = 'bigicon' and data_type='varchar' and character_maximum_length=200) 
alter table messages_type 
alter column bigicon varchar(200); 
GO

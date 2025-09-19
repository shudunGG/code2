-- 所有脚本可直接复制到sql server查询设计器中执行
if  exists (select * from information_schema.columns  where  table_name = 'messages_rule' and column_name='contentlegth')
alter  table messages_rule drop column contentlegth;
GO

if  not exists (select * from information_schema.columns  where  table_name = 'messages_rule' and column_name='contentlength')
alter  table messages_rule add  contentlength int;
GO




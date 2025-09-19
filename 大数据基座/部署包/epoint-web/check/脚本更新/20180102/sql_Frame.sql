-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/01/02
-- e讯发送消息内容字段类型改为text--王露
if not exists (select * from information_schema.columns where  table_name = 'exun_message' and column_name = 'content' and data_type='ntext') 
alter table exun_message 
alter column content ntext; 
GO
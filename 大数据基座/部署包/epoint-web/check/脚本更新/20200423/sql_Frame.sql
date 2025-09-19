-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/04/22
-- COMM_MESSAGE_REMIND_INFO表targetusername，targetuserguid字段改为Text
if not exists (select * from information_schema.columns where  table_name = 'COMM_MESSAGE_REMIND_INFO' and column_name = 'targetuserguid' and data_type='text') 
alter table COMM_MESSAGE_REMIND_INFO 
alter column targetuserguid text; 
GO

if not exists (select * from information_schema.columns where  table_name = 'COMM_MESSAGE_REMIND_INFO' and column_name = 'targetusername' and data_type='text') 
alter table COMM_MESSAGE_REMIND_INFO 
alter column targetusername text; 
GO
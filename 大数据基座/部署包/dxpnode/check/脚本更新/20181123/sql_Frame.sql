-- 所有脚本可直接复制到sql server查询设计器中执行
-- app_info表新增字段issyncmessage --徐剑

if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncmessage' ) 
alter table app_info add issyncmessage int; 
GO
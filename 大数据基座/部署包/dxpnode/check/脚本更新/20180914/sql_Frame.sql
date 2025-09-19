-- 所有脚本可直接复制到sql server查询设计器中执行
-- app_info表新增字段issyncwaithandle --徐剑

if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncwaithandle' ) 
alter table app_info add issyncwaithandle int; 
GO
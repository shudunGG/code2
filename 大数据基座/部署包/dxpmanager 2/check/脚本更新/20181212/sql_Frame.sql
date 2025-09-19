-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/21
if not exists (select name from syscolumns  where id = object_id('api_document') and name='outline' ) 
alter table api_document add outline varchar(1000);
GO
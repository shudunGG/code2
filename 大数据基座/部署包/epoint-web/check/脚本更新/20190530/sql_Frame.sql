-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/5/20
-- code_main添加baseouguid字段 --【徐剑】

-- code_main添加baseouguid字段
if not exists (select name from syscolumns  where id = object_id('code_main') and name='baseouguid' ) 
alter table code_main add baseouguid  nvarchar(50); 
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/30
-- 【epointsform_tablerelation添加字段multitableid】 --【薛炳】
if not exists (select name from syscolumns  where id = object_id('epointsform_tablerelation') and name='multitableid' ) 
alter table epointsform_tablerelation add multitableid  int; 
GO

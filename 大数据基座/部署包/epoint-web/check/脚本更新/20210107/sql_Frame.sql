-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/12/25
-- workflow_activity表增加isallowattachwrite字段 --cdy
if not exists (select name from syscolumns  where id = object_id('workflow_activity') and name='isallowattachwrite') 
alter table workflow_activity add isallowattachwrite  nvarchar(100); 
GO


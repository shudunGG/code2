-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/20
-- WorkflowProcess表新增自定义流程类型字段customType --季立霞

-- 添加字段customType
if not exists (select name from syscolumns  where id = object_id('workflow_process') and name='customtype' ) 
alter table workflow_process add customtype  int; 
GO


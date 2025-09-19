-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/08/29 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('workflow_transition_condition') and name='remark' ) 
alter table workflow_transition_condition add remark  nvarchar(100); 
GO

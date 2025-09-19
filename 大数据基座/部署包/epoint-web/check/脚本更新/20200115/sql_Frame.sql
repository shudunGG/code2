-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/1/15
-- workflow_transition表IS_SHOWOVERTIMEPOINT字段改为int类型 -- 徐剑

-- 修改字段示例
if exists (select * from information_schema.columns  where  table_name = 'workflow_transition' and column_name='IS_SHOWOVERTIMEPOINT') 
alter table workflow_transition 
alter column IS_SHOWOVERTIMEPOINT int;  
GO

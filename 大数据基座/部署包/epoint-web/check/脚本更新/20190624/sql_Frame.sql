-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/06/24 
-- workflow_pvi表添加baseouguid --季海英
if not exists (select * from information_schema.columns  where  table_name = 'workflow_pvi' and column_name='baseouguid') 
alter table workflow_pvi add baseouguid nvarchar(100); 
GO

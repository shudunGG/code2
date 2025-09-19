-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/07/19
-- api_runtime_log添加useragent字段 --周志豪

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('api_runtime_log') and name='useragent' ) 
alter table api_runtime_log add useragent  nvarchar(200); 
GO

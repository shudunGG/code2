-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/09/26 【时间】
-- 添加表api_runtime_log添加字段consumerguid --【俞俊男】

-- 添加consumerId字段
if not exists (select name from syscolumns  where id = object_id('api_runtime_log') and name='consumerguid' ) 
alter table api_runtime_log add consumerguid  nvarchar(50); 
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/07
-- app_role_relation添加字段allowtype -- 周志豪

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('app_role_relation') and name='allowtype' ) 
alter table app_role_relation add allowtype  nvarchar(50); 
GO


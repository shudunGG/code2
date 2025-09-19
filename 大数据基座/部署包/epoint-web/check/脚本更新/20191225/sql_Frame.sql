-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/10/24
-- 【datasource添加字段smartbisid，同步SmartBI数据源，用于存sid】 --【季海英】

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('datasource') and name='smartbisid' ) 
alter table datasource add smartbisid  nvarchar(100); 
GO

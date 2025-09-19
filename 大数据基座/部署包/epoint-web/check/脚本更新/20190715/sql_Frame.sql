-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/09【时间】
-- app_info表添加issyncworkflow字段-- 季立霞

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncworkflow' ) 
alter table app_info add issyncworkflow  int default 0; 
GO

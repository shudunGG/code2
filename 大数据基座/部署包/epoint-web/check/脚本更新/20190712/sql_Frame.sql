-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/02 【时间】
-- Frame_UserRoleRelation表添加ouguid字段 --【徐剑】

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('Frame_UserRoleRelation') and name='ouguid' ) 
alter table Frame_UserRoleRelation add ouguid nvarchar(50); 
GO

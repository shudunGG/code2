-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/11/11 【时间】
-- Frame_Module表添加whitelist字段 --徐剑

-- Frame_Module表添加whitelist字段
if not exists (select name from syscolumns  where id = object_id('Frame_Module') and name='whitelist' ) 
alter table Frame_Module add whitelist text; 
GO

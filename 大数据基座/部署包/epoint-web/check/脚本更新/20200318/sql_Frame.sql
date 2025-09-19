-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/03/18
-- 添加表frame_privacy_agree字段 --【孟佳佳】
-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('frame_privacy_agree') and name='status' ) 
alter table frame_privacy_agree add status int default 1; 
GO
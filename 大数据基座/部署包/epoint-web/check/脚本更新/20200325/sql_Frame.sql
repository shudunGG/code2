-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/03/18
-- 添加表frame_soanotify_log字段 --【何晓瑜】
-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('frame_soanotify_log') and name='clienttag' ) 
alter table frame_soanotify_log add clienttag varchar(50); 
GO
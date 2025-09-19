-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/4/18
if not exists (select name from syscolumns  where id = object_id('frame_user') and name='framemj' ) 
alter table frame_user add framemj int default 0; 
GO
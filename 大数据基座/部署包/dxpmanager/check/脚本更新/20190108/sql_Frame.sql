-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/01/08
if not exists (select name from syscolumns  where id = object_id('frame_portal') and name='opentype' ) 
alter table frame_portal add opentype varchar(50);
GO
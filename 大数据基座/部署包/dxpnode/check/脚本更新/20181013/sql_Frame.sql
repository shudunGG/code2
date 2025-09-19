-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/10/13

if not exists (select name from syscolumns  where id = object_id('frame_user') and name='MD5ID' ) 
alter table frame_user add MD5ID nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('frame_user_snapshot') and name='MD5ID' ) 
alter table frame_user_snapshot add MD5ID nvarchar(50);
GO
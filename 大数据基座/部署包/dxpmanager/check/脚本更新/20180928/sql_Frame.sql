-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/28

-- 添加平台字段 --施佳炜
if not exists (select name from syscolumns  where id = object_id('frame_login_log') and name='platform' ) 
alter table frame_login_log add platform nvarchar(50); 
GO


-- 添加平台字段
if not exists (select * from information_schema.columns  where  table_name = 'frame_login_lockinfo' and column_name='platform') 
alter table frame_login_lockinfo add platform nvarchar(50);
GO
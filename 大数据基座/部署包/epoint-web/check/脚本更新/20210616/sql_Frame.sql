-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2021/6/16
-- 表frame_user_snapshot添加字段gesturepassword,hiredate --【白钦】
-- 表frame_ou_snapshot添加字段oucodefull --【白钦】


-- 表frame_user_snapshot添加字段gesturepassword,hiredate
if not exists (select name from syscolumns  where id = object_id('frame_user_snapshot') and name='gesturepassword' ) 
alter table frame_user_snapshot add gesturepassword  nvarchar(500); 
GO
if not exists (select name from syscolumns  where id = object_id('frame_user_snapshot') and name='hiredate' ) 
alter table frame_user_snapshot add hiredate datetime; 
GO


-- 表frame_ou_snapshot添加字段oucodefull
if not exists (select name from syscolumns  where id = object_id('frame_ou_snapshot') and name='oucodefull' ) 
alter table frame_ou_snapshot add oucodefull nvarchar(100); 
GO
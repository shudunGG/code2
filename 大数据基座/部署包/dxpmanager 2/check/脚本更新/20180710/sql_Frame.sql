-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/07/10
-- 修改frame_ip_lockinfo -- 王颜
if exists (select name from syscolumns where id = object_id('frame_ip_lockinfo') and name='Client_ip') 
EXEC sp_rename 'frame_ip_lockinfo.Client_ip', 'Clientip', 'COLUMN';
GO

if exists (select name from syscolumns where id = object_id('frame_ip_lockinfo') and name='Ip_type') 
EXEC sp_rename 'frame_ip_lockinfo.Ip_type', 'Iptype', 'COLUMN';
GO
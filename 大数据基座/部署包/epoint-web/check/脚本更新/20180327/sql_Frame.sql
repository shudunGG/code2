-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/03/27

-- 修改frame_ip_lockinfo -- 施佳炜
if not exists (select name from syscolumns where id = object_id('frame_ip_lockinfo') and name='Ip_manager_type') 
alter table frame_ip_lockinfo add Ipmanagertype varchar(50);
else
EXEC sp_rename 'frame_ip_lockinfo.Ip_manager_type', 'Ipmanagertype', 'COLUMN';
GO




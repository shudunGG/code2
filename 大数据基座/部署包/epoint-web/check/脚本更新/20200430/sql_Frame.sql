-- 所有脚本可直接复制到sql server查询设计器中执行
-- 修改frame_userrolerelation索引，uq_frame_userrolerelation(USERGUID, ROLEGUID,OUGUID) -- 陈端一
if exists (SELECT * FROM sys.sysindexes WHERE id=object_id('frame_userrolerelation') and name='uq_frame_userrolerelation')
drop index uq_frame_userrolerelation on frame_userrolerelation;
GO
if not exists (SELECT name FROM sys.sysindexes WHERE id=object_id('frame_userrolerelation') and name='uq_frame_userrolerelation')
create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID,OUGUID);
GO
-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/02/29
-- soa相关快照表检测并增加主键及唯一键，防止同步后删除所有数据,此脚本会清空快照表，执行完后接入应用需要重启--樊志君 
truncate table frame_ou_snapshot;
truncate table frame_ou_e_snapshot;
truncate table frame_user_snapshot;
truncate table frame_user_e_snapshot;
truncate table frame_secondou_snapshot;
truncate table frame_roletype_snapshot;
truncate table frame_role_snapshot;
truncate table frame_userrole_snapshot;
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_ou_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_ou_snapshot')  and type='PK') 
alter table frame_ou_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_ou_snapshot') and name='uq_frame_ou_snapshot' and type='UQ') 
ALTER TABLE frame_ou_snapshot  ADD CONSTRAINT uq_frame_ou_snapshot UNIQUE (ouguid, appkey, clientip);
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_ou_e_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_ou_e_snapshot')  and type='PK') 
alter table frame_ou_e_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_ou_e_snapshot') and name='uq_frame_ou_e_snapshot' and type='UQ') 
ALTER TABLE frame_ou_e_snapshot  ADD CONSTRAINT uq_frame_ou_e_snapshot UNIQUE (ouguid, appkey, clientip);
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_user_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_user_snapshot')  and type='PK') 
alter table frame_user_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_user_snapshot') and name='uq_frame_user_snapshot' and type='UQ') 
ALTER TABLE frame_user_snapshot  ADD CONSTRAINT uq_frame_user_snapshot UNIQUE (userguid, appkey, clientip);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_user_e_snapshot')  and type='PK') 
alter table frame_user_e_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_user_e_snapshot') and name='uq_frame_user_e_snapshot' and type='UQ') 
ALTER TABLE frame_user_e_snapshot  ADD CONSTRAINT uq_frame_user_e_snapshot UNIQUE (userguid, appkey, clientip);
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_secondou_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_secondou_snapshot')  and type='PK') 
alter table frame_secondou_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_secondou_snapshot') and name='uq_frame_secondou_snapshot' and type='UQ') 
ALTER TABLE frame_secondou_snapshot  ADD CONSTRAINT uq_frame_secondou_snapshot UNIQUE (userguid, ouguid, appkey, clientip);
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_roletype_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_roletype_snapshot')  and type='PK') 
alter table frame_roletype_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_roletype_snapshot') and name='uq_frame_roletype_snapshot' and type='UQ') 
ALTER TABLE frame_roletype_snapshot  ADD CONSTRAINT uq_frame_roletype_snapshot UNIQUE (roletypeguid, appkey, clientip);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_role_snapshot')  and type='PK') 
alter table frame_role_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_role_snapshot') and name='uq_frame_role_snapshot' and type='UQ') 
ALTER TABLE frame_role_snapshot  ADD CONSTRAINT uq_frame_role_snapshot UNIQUE (roleguid, appkey, clientip);
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'rowguid' and is_nullable='no') 
alter table frame_userrole_snapshot 
alter column rowguid nvarchar(50) not null;  
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_userrole_snapshot')  and type='PK') 
alter table frame_userrole_snapshot add primary key (rowguid);
GO

if not exists (SELECT * from sys.key_constraints where parent_object_id=object_id('frame_userrole_snapshot') and name='uq_frame_userrole_snapshot' and type='UQ') 
ALTER TABLE frame_userrole_snapshot  ADD CONSTRAINT uq_frame_userrole_snapshot UNIQUE (userguid,roleguid, appkey, clientip);
GO


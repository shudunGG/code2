-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2018/02/29
-- soa相关快照表检测并增加主键及唯一键，防止同步后删除所有数据,此脚本会清空快照表，执行完后接入应用需要重启--樊志君
drop procedure if exists`epoint_snap_alter`;
GO
create  procedure `epoint_snap_alter`()
begin 
if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_ou_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_ou_snapshot;
    alter table frame_ou_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_ou_snapshot' and t.CONSTRAINT_NAME='uq_frame_ou_snapshot') then
	truncate table frame_ou_snapshot;
    alter table frame_ou_snapshot  ADD CONSTRAINT uq_frame_ou_snapshot UNIQUE (ouguid, appkey, clientip);
end if;


if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_ou_e_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_ou_e_snapshot;
    alter table frame_ou_e_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_ou_e_snapshot' and t.CONSTRAINT_NAME='uq_frame_ou_e_snapshot') then
	truncate table frame_ou_e_snapshot;
    alter table frame_ou_e_snapshot  ADD CONSTRAINT uq_frame_ou_e_snapshot UNIQUE (ouguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_user_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_user_snapshot;
    alter table frame_user_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_user_snapshot' and t.CONSTRAINT_NAME='uq_frame_user_snapshot') then
	truncate table frame_user_snapshot;
    alter table frame_user_snapshot  ADD CONSTRAINT uq_frame_user_snapshot UNIQUE (userguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_user_e_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_user_e_snapshot;
    alter table frame_user_e_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_user_e_snapshot' and t.CONSTRAINT_NAME='uq_frame_user_e_snapshot') then
	truncate table frame_user_e_snapshot;
    alter table frame_user_e_snapshot  ADD CONSTRAINT uq_frame_user_e_snapshot UNIQUE (userguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_secondou_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_secondou_snapshot;
    alter table frame_secondou_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_secondou_snapshot' and t.CONSTRAINT_NAME='uq_frame_secondou_snapshot') then
	truncate table frame_secondou_snapshot;
    alter table frame_secondou_snapshot  ADD CONSTRAINT uq_frame_secondou_snapshot UNIQUE (userguid, ouguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_roletype_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_roletype_snapshot;
    alter table frame_roletype_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_roletype_snapshot' and t.CONSTRAINT_NAME='uq_frame_roletype_snapshot') then
	truncate table frame_roletype_snapshot;
    alter table frame_roletype_snapshot  ADD CONSTRAINT uq_frame_roletype_snapshot UNIQUE (roletypeguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_role_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_role_snapshot;
    alter table frame_role_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_role_snapshot' and t.CONSTRAINT_NAME='uq_frame_role_snapshot') then
	truncate table frame_role_snapshot;
    alter table frame_role_snapshot  ADD CONSTRAINT uq_frame_role_snapshot UNIQUE (roleguid, appkey, clientip);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_userrole_snapshot' and t.CONSTRAINT_NAME = 'PRIMARY') then
	truncate table frame_userrole_snapshot;
    alter table frame_userrole_snapshot add primary key (rowguid);
end if;

if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='frame_userrole_snapshot' and t.CONSTRAINT_NAME='uq_frame_userrole_snapshot') then
	truncate table frame_userrole_snapshot;
    alter table frame_userrole_snapshot  ADD CONSTRAINT uq_frame_userrole_snapshot UNIQUE (userguid,roleguid, appkey, clientip);
end if;

end;
GO
call epoint_snap_alter();
GO
drop procedure if exists `epoint_snap_alter`;
GO

-- DELIMITER ; --
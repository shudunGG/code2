-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/30 【时间】
-- zzz_ecloud_check添加主键  --陈端一

drop procedure if exists`epoint_snap_alter`;
GO
create  procedure `epoint_snap_alter`()
begin 
if not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() and t.TABLE_NAME='zzz_ecloud_check' and t.CONSTRAINT_NAME = 'PRIMARY') then
    alter table zzz_ecloud_check add primary key (id);
end if;
end;
GO
call epoint_snap_alter();
GO
drop procedure if exists  `epoint_snap_alter`;
GO


-- 如果frame_userrolerelation存在FRAME_USERROLERELATION_INDEX索引，删除索引，重新建唯一索引uq_frame_userrolerelation（USERGUID, ROLEGUID, OUGUID）
drop procedure if exists`epoint_snap_alter`;
GO
create  procedure `epoint_snap_alter`()
begin
if  not exists (select null from information_schema.statistics where table_schema=database()  and  TABLE_NAME = 'frame_userrolerelation' and INDEX_NAME='uq_frame_userrolerelation' and COLUMN_NAME='ouguid') then
drop index uq_frame_userrolerelation on frame_userrolerelation;
alter table frame_userrolerelation add Unique uq_frame_userrolerelation(USERGUID, ROLEGUID, OUGUID);
end if;
end;
GO
call epoint_snap_alter();
GO
drop procedure if exists  `epoint_snap_alter`;
GO

-- DELIMITER ; --


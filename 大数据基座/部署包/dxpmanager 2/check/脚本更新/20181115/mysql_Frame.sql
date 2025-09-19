-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/11/15
-- BELONGUSERGUID、BELONGDISPLAYNAM字段长度增长
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_job' and column_name = 'BELONGUSERGUID' and data_type = 'varchar' and character_maximum_length=2000) then
    alter table frame_job modify BELONGUSERGUID varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_job' and column_name = 'BELONGDISPLAYNAME' and data_type = 'varchar' and character_maximum_length=2000) then
    alter table frame_job modify BELONGDISPLAYNAME varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
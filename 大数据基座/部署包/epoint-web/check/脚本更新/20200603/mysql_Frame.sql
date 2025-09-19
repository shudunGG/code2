-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- frame_ou_snapshot表修改OrderNumberFull字段长度为1000
-- Frame_UserRole_snapshot表添加ouguid字段 


-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select * from information_schema.columns where table_schema = database() AND table_name = 'frame_ou_snapshot' and column_name = 'OrderNumberFull'  and  character_maximum_length=1000) then
    alter table frame_ou_snapshot  modify OrderNumberFull varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- Frame_UserRole_snapshot表添加ouguid字段 

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_UserRole_snapshot' and column_name = 'ouguid') then
    alter table  Frame_UserRole_snapshot add column ouguid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
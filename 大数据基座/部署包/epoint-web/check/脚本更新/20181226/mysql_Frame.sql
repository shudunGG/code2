-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if  exists (select * from information_schema.columns where table_schema = database() AND table_name = 'frame_userrole_snapshot' and column_name = 'row_id' and data_type='int' and IS_NULLABLE ='NO') then
    alter table frame_userrole_snapshot  modify row_id int(11) null;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
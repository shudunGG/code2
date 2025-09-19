-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- frame_user表row_id字段为空
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if  NOT exists (select * from information_schema.columns where table_schema = database() AND table_name = 'frame_user' and column_name = 'row_id' and data_type='int' and IS_NULLABLE ='YES') then
    alter table frame_user  modify row_id int null;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
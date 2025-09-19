-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/09/02
-- epointsform_designtemp表添加idsremark

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_designtemp' and column_name = 'idsremark') then
    alter table epointsform_designtemp add column idsremark longtext;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(*) from information_schema.columns where TABLE_SCHEMA=DATABASE() and TABLE_NAME='eia_jobruninfo' and COLUMN_NAME='livysessionId')<1
     then
            alter table eia_jobruninfo add COLUMN livysessionId varchar(255);
            alter table eia_jobruninfo add COLUMN livysessionhandle varchar(255);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
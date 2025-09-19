-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'eia_modulestep' AND COLUMN_NAME='isDelete')<1 then
alter table eia_modulestep add COLUMN isDelete VARCHAR(10) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
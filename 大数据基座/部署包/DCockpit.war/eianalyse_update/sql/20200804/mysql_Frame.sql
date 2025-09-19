-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_warning_result' and column_name='normResult')<1
     then
		ALTER TABLE cockpit_warning_result ADD column normResult int(11) DEFAULT 0;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
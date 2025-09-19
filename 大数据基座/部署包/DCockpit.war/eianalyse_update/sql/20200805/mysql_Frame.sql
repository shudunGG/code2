-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_job_log')<1
     then
		CREATE TABLE `cockpit_job_log` (
		  `rowguid` varchar(50) NOT NULL,
		  `jobStartTime` datetime DEFAULT NULL,
		  `jobEndTime` datetime DEFAULT NULL,
		  `jobStatus` varchar(5) DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `normName` varchar(50) DEFAULT NULL,
		  `jobLog` text DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_warningrule_compute_relation')<1
     then
		CREATE TABLE `cockpit_warningrule_compute_relation` (
		  `rowguid` varchar(50) NOT NULL,
		  `roleguid` varchar(50) DEFAULT NULL,
		  `warningruleguid` varchar(50) DEFAULT NULL,
		  `deleteuserguid` varchar(50) DEFAULT NULL,
		  `canceluserguid` varchar(50) DEFAULT NULL,
		  `computeguid` varchar(50) DEFAULT NULL,
		  `userguid` varchar(50) DEFAULT NULL,
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
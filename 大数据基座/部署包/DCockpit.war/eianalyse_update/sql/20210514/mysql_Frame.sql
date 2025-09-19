drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_push')<1
    then 
    	CREATE TABLE `cockpit_norm_push` (
		  `rowguid` varchar(50) NOT NULL,
		  `normguid` varchar(50) DEFAULT NULL,
		  `createtime` datetime DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
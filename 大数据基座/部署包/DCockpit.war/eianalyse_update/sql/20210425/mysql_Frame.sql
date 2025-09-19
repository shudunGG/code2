drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_score' )<1
     then
		CREATE TABLE `cockpit_norm_score` (
		  `rowGuid` varchar(50) NOT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `normName` varchar(200) DEFAULT NULL,
		  `score` double DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_score_history' )<1
     then
		CREATE TABLE `cockpit_norm_score_history` (
		  `rowGuid` varchar(255) NOT NULL,
		  `batch` bigint(30) DEFAULT NULL,
		  `createTime` datetime DEFAULT NULL,
		  `attachGuid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_monitor_norm' )<1
     then
		CREATE TABLE `cockpit_monitor_norm` (
		  `rowguid` varchar(50) NOT NULL,
		  `userguid` varchar(50) DEFAULT NULL,
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
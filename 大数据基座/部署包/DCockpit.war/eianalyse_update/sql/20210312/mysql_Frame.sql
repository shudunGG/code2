drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_norm_notes')<1
     then 
     	CREATE TABLE `cockpit_norm_notes` (
  		`rowguid` varchar(50) NOT NULL,
  		`NormName` varchar(50) DEFAULT NULL,
  		`normguid` varchar(50) DEFAULT NULL,
  		`notes` text,
  		`createuserguid` varchar(50) DEFAULT NULL,
  		`receiveuserguid` varchar(50) DEFAULT NULL,
 		`receiveouguid` varchar(50) DEFAULT NULL,
  		`createouguid` varchar(50) DEFAULT NULL,
  		`operatedate` datetime DEFAULT NULL,
  		`receivedate` datetime DEFAULT NULL,
  		`status` varchar(10) DEFAULT NULL,
  		`iscancel` varchar(10) DEFAULT NULL,
  		`attachguid` varchar(50) DEFAULT NULL,
  		PRIMARY KEY (`rowguid`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_norm_set_relate')<1
     then 
		CREATE TABLE `cockpit_norm_set_relate` (
  		`rowguid` varchar(50) DEFAULT NULL,
  		`normname` varchar(50) DEFAULT NULL,
  		`normguid` varchar(50) DEFAULT NULL,
  		`setguid` varchar(50) DEFAULT NULL,
  		`normsetname` varchar(50) DEFAULT NULL,
  		`CreateUserGuid` varchar(50) DEFAULT NULL,
  		`CreateTime` datetime DEFAULT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_set'  and column_name='parentguid')<1
     then 
     	ALTER TABLE cockpit_norm_set ADD parentguid varchar(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
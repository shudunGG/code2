drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_set' )<1
     then 
     	CREATE TABLE `cockpit_norm_set` (
		  `rowguid` varchar(50) NOT NULL,
		  `normsetname` varchar(100) DEFAULT NULL,
		  `apicode` varchar(50) DEFAULT NULL,
		  `remark` text,
		  `CreateUserGuid` varchar(50) DEFAULT NULL,
		  `belongouguid` varchar(50) DEFAULT NULL,
		  `CreateTime` datetime DEFAULT NULL,
		  `isOpen` varchar(10) DEFAULT NULL,
		  `setSource` varchar(10) DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_set_apply' )<1
     then 
     	CREATE TABLE `cockpit_norm_set_apply` (
		  `rowguid` varchar(50) NOT NULL,
		  `setguid` varchar(50) DEFAULT NULL,
		  `applyReason` text,
		  `applyUserGuid` varchar(50) DEFAULT NULL,
		  `applyOuGuid` varchar(50) DEFAULT NULL,
		  `checkUserGuid` varchar(50) DEFAULT NULL,
		  `applyTime` date DEFAULT NULL,
		  `applyStatus` varchar(10) DEFAULT NULL,
		  `applyType` varchar(10) DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='normsource')<1
     then 
     	ALTER TABLE cockpit_norm ADD normsource VARCHAR(10) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='apicode')<1
     then 
     	ALTER TABLE cockpit_norm ADD apicode VARCHAR(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='setguid')<1
     then 
     	ALTER TABLE cockpit_norm ADD setguid VARCHAR(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_authorization')<1
    then 
     	CREATE TABLE `cockpit_authorization` (
		`rowguid` varchar(100) NOT NULL,
		`createuser` varchar(100) DEFAULT NULL,
		`authguid` varchar(100) DEFAULT NULL,
		`authtype` varchar(100) DEFAULT NULL,
		`userguid` varchar(100) DEFAULT NULL,
		`authtime` datetime DEFAULT NULL,
		PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='title')<1
    then 
     	ALTER TABLE cockpit_redlight ADD title varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='isPriority')<1
    then 
     	ALTER TABLE cockpit_redlight ADD isPriority varchar(5) DEFAULT '0';
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='expectedPerformanceTime')<1
    then 
     	ALTER TABLE cockpit_redlight ADD expectedPerformanceTime datetime DEFAULT NULL;
	end if;
	
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
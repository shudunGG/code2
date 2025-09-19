drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_template_js'  and column_name='url')<1
    then 
    	ALTER TABLE cockpit_card_template_js ADD url VARCHAR(500) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_monitor'  and column_name='userguid')<1
    then 
    	ALTER TABLE cockpit_monitor add userguid varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_map' )<1
     then
		CREATE TABLE `cockpit_card_norm_map` (
		  `rowguid` varchar(50) NOT NULL,
		  `showfield` varchar(50) DEFAULT NULL,
		  `mapfield` varchar(50) DEFAULT NULL,
		  `cardnormguid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
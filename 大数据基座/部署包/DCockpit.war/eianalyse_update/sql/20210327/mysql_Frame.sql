drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='needCheck')<1
    then 
     	ALTER TABLE cockpit_norm ADD needCheck varchar(5) DEFAULT 'false';
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_result_check')<1
    then 
     	CREATE TABLE `cockpit_norm_result_check` (
		  `rowGuid` varchar(50) NOT NULL,
		  `createDate` datetime DEFAULT NULL,
		  `applyDate` datetime DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `applyStatus` varchar(5) DEFAULT NULL,
		  `pviGuid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_result_check_relation')<1
    then 
     	CREATE TABLE `cockpit_norm_result_check_relation` (
		  `rowGuid` varchar(50) NOT NULL,
		  `operateDate` datetime DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `normtype` varchar(5) DEFAULT NULL,
		  `resultjson` text,
		  `fieldCount` double DEFAULT NULL,
		  `fielddim` varchar(255) DEFAULT NULL,
		  `fielddim2` varchar(255) DEFAULT NULL,
		  `fielddim3` varchar(100) DEFAULT NULL,
		  `fielddim4` varchar(100) DEFAULT NULL,
		  `fielddim5` varchar(100) DEFAULT NULL,
		  `fieldTimewindow` varchar(50) DEFAULT NULL,
		  `ouGuid` varchar(50) DEFAULT NULL,
		  `sortnum` int(11) DEFAULT NULL,
		  `checkGuid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`) USING BTREE,
		  KEY `IX_NormGuid` (`normGuid`) USING BTREE,
		  KEY `IX_FieldCount` (`fieldCount`) USING BTREE,
		  KEY `IX_FieldTimewindow` (`fieldTimewindow`) USING BTREE,
		  KEY `IX_FieldDim` (`fielddim`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
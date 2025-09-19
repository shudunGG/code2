drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_subscribe' )<1
     then
		CREATE TABLE `cockpit_norm_subscribe` (
		  `rowGuid` varchar(50) NOT NULL,
		  `subscriber` varchar(50) DEFAULT NULL,
		  `subscribeOu` varchar(50) DEFAULT NULL,
		  `subscribeTime` datetime DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `cardGuid` varchar(50) DEFAULT NULL,
		  `cardCateGuid` varchar(50) DEFAULT NULL,
		  `plateGuid` varchar(50) DEFAULT NULL,
		  `projectGuid` varchar(50) DEFAULT NULL,
		  `projectCateGuid` varchar(50) DEFAULT NULL,
		  `columnGuid` varchar(50) DEFAULT NULL,
		  `cockpitGuid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm'  and column_name='label')<1
    then 
     	ALTER TABLE cockpit_card_norm ADD label varchar(100) DEFAULT 'false';
     	ALTER TABLE cockpit_card_norm ADD normtype varchar(50) DEFAULT 'false';
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_dim' )<1
     then
		CREATE TABLE `cockpit_card_norm_dim` (
		  `rowguid` varchar(50) NOT NULL,
		  `cardguid` varchar(50) DEFAULT NULL,
		  `cardnormguid` varchar(50) DEFAULT NULL,
		  `dim` varchar(50) DEFAULT NULL,
		  `label` varchar(100) DEFAULT NULL,
		  `ordernum` int(11) DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_result' )<1
     then
		CREATE TABLE `cockpit_card_norm_result` (
		  `RowGuid` varchar(50) NOT NULL,
		  `cardNormGuid` varchar(50) DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `fieldCount` double DEFAULT NULL,
		  `FieldDim` varchar(255) DEFAULT NULL,
		  `fielddim2` varchar(255) DEFAULT NULL,
		  `fielddim3` varchar(100) DEFAULT NULL,
		  `fielddim4` varchar(100) DEFAULT NULL,
		  `fielddim5` varchar(100) DEFAULT NULL,
		  `FieldTimewindow` varchar(50) DEFAULT NULL,
		  `normtype` varchar(5) DEFAULT NULL,
		  `resultjson` text,
		  `ouGuid` varchar(50) DEFAULT NULL,
		  `sortnum` int(11) DEFAULT NULL,
		  `checkGuid` varchar(255) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`) USING BTREE,
		  KEY `IX_NormGuid` (`normGuid`) USING BTREE,
		  KEY `IX_FieldCount` (`fieldCount`) USING BTREE,
		  KEY `IX_FieldTimewindow` (`FieldTimewindow`) USING BTREE,
		  KEY `IX_FieldDim` (`FieldDim`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_result_check' )<1
     then
		CREATE TABLE `cockpit_card_norm_result_check` (
		  `rowGuid` varchar(50) NOT NULL,
		  `cardGuid` varchar(50) DEFAULT NULL,
		  `createDate` datetime DEFAULT NULL,
		  `applyDate` datetime DEFAULT NULL,
		  `applyStatus` varchar(5) DEFAULT NULL,
		  `cardareasummary` varchar(50) DEFAULT NULL,
		  `pviGuid` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`RowGuid`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
    if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_model_relation')<1
    then 
    	CREATE TABLE `cockpit_card_model_relation` (
		  `rowGuid` varchar(50) NOT NULL,
		  `cardGuid` varchar(50) DEFAULT NULL,
		  `modelGuid` varchar(50) DEFAULT NULL,
		  `cardDataGuid` varchar(50) DEFAULT NULL,
		  `cardDataType` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_relation')<1
    then 
    	CREATE TABLE `cockpit_card_norm_relation` (
		  `rowGuid` varchar(50) NOT NULL,
		  `cardDataGuid` varchar(50) DEFAULT NULL,
		  `normType` varchar(50) DEFAULT NULL,
		  `normGuid` varchar(50) DEFAULT NULL,
		  `modelRelationGuid` varchar(50) DEFAULT NULL,
		  `unit` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm_relation_field')<1
    then 
    	CREATE TABLE `cockpit_card_norm_relation_field` (
		  `rowGuid` varchar(50) NOT NULL,
		  `relationGuid` varchar(50) DEFAULT NULL,
		  `fieldType` varchar(50) DEFAULT NULL,
		  `fieldKey` varchar(50) DEFAULT NULL,
		  `fieldValue` varchar(50) DEFAULT NULL,
		  PRIMARY KEY (`rowGuid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
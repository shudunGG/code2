drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'webinfo_category' )<1
     then 
     	CREATE TABLE `webinfo_category` (
  		`rowguid` varchar(50) NOT NULL,
  		`categoryname` varchar(50) DEFAULT NULL,
  		`categorynum` varchar(50) DEFAULT NULL,
  		`parentguid` varchar(50) DEFAULT NULL,
  		`ordernum` int(11) DEFAULT NULL,
  		`createuserguid` varchar(50) DEFAULT NULL,
  		`createouguid` varchar(50) DEFAULT NULL,
 		 `operatedate` date DEFAULT NULL,
 	 	PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'webinfo_infomation' )<1
     then 
     	CREATE TABLE `webinfo_infomation` (
  		`rowguid` varchar(50) NOT NULL,
  		`categoryguid` varchar(50) DEFAULT NULL,
 		`title` varchar(50) DEFAULT NULL,
  		`content` text,
  		`pubtime` date DEFAULT NULL,
  		`createuserguid` varchar(50) DEFAULT NULL,
  		`createouguid` varchar(50) DEFAULT NULL,
  		`ordernum` int(11) DEFAULT NULL,
  		PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;    
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_notes' )<1
     then
     CREATE TABLE `cockpit_card_notes` (
  		`rowguid` varchar(50) NOT NULL,
  		`NormDomain` varchar(50) DEFAULT NULL,
  		`CardName` varchar(50) DEFAULT NULL,
  		`cardguid` varchar(50) DEFAULT NULL,
  		`notes` text,
  		`createuserguid` varchar(50) DEFAULT NULL,
  		`createouguid` varchar(50) DEFAULT NULL,
  		`operatedate` date DEFAULT NULL,
  		PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
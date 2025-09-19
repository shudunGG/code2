drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_apicate')<1
     then
CREATE TABLE `cockpit_apicate` (
  `categoryName` varchar(50) DEFAULT NULL,
  `orderNum` int(11) DEFAULT NULL,
  `operateDate` date DEFAULT NULL,
  `rowguid` varchar(50) NOT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_apiinfo')<1
     then
CREATE TABLE `cockpit_apiinfo` (
  `serviceName` varchar(50) DEFAULT NULL,
  `userguid` varchar(2000) DEFAULT NULL,
  `ouguid` varchar(50) DEFAULT NULL,
  `requestType` varchar(1) DEFAULT NULL,
  `apiurltype` varchar(255) DEFAULT NULL,
  `apiUrl` varchar(2000) DEFAULT NULL,
  `contentType` varchar(50) DEFAULT NULL,
  `rowguid` varchar(50) NOT NULL,
  `categoryguid` varchar(50) DEFAULT NULL,
  `operateDate` date DEFAULT NULL,
  `orderNum` int(11) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `isPublic` varchar(50) DEFAULT NULL,
  `authUserguids` text,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
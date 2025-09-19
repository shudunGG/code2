drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_mobile_plate')<1
     then
CREATE TABLE `cockpit_mobile_plate` (
  `rowGuid` varchar(50) DEFAULT NULL,
  `projectGuid` varchar(50) DEFAULT NULL,
  `plateName` varchar(50) DEFAULT NULL,
  `orderNum` int(11) DEFAULT NULL,
  `remark` text,
  `status` varchar(10) DEFAULT NULL,
  `createUserGuid` varchar(50) DEFAULT NULL,
  `belongOuGuid` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_mobile_card_cate')<1
     then
CREATE TABLE `cockpit_mobile_card_cate` (
  `rowguid` varchar(50) NOT NULL,
  `cardCateName` varchar(200) DEFAULT NULL,
  `plateGuid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
  if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_mobile_card')<1
     then
CREATE TABLE `cockpit_mobile_card` (
  `rowguid` varchar(50) NOT NULL,
  `cardName` varchar(200) DEFAULT NULL,
  `apiCode` varchar(50) DEFAULT NULL,
  `remark` text,
  `belongOuGuid` varchar(50) DEFAULT NULL,
  `plateGuid` varchar(50) DEFAULT NULL,
  `liableperguid` varchar(50) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `orderNum` int(11) DEFAULT NULL,
  `cardCateGuid` varchar(50) DEFAULT NULL,
  `cardModelGuid` varchar(50) DEFAULT NULL,
  `normSetGuid` varchar(50) DEFAULT NULL,
  `normguids` text DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_category' )<1
     then
		CREATE TABLE `cockpit_info_category` (
		`rowguid` varchar(100) NOT NULL,
		`categoryname` varchar(100) DEFAULT NULL,
		`categorynum` varchar(100) DEFAULT NULL,
		`parentguid` varchar(100) DEFAULT NULL,
		`status` varchar(5) DEFAULT NULL,
		`isleaf` varchar(5) DEFAULT NULL,
		`ordernum` int(11) DEFAULT NULL,
		`remark` text,
		`createuserguid` varchar(100) DEFAULT NULL,
		`createouguid` varchar(100) DEFAULT NULL,
		`operatedate` datetime DEFAULT NULL,
		`createtime` datetime DEFAULT NULL,
		PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_detail' )<1
     then
		CREATE TABLE `cockpit_info_detail` (
		`rowguid` varchar(100) NOT NULL,
		`title` varchar(100) DEFAULT NULL,
		`titletype` varchar(10) DEFAULT NULL,
		`categoryguid` varchar(100) DEFAULT NULL,
		`infotype` varchar(10) DEFAULT NULL,
		`pubtime` datetime DEFAULT NULL,
		`edittime` datetime DEFAULT NULL,
		`status` varchar(10) DEFAULT NULL,
		`titlepic` varchar(100) DEFAULT NULL,
		`listpic` varchar(100) DEFAULT NULL,
		`content` text,
		`overview` varchar(255) DEFAULT NULL,
		`createuserguid` varchar(100) DEFAULT NULL,
		`ordernum` int(11) DEFAULT NULL,
		`attach` varchar(255) DEFAULT NULL,
		`createouguid` varchar(100) DEFAULT NULL,
		`url` varchar(100) DEFAULT NULL,
		PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
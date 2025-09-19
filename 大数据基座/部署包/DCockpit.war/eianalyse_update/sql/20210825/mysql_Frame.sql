drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_info_detail_review')<1
     then
            CREATE TABLE `cockpit_info_detail_review` (
			  `rowguid` varchar(50) NOT NULL,
			  `infoguid` varchar(50) DEFAULT NULL,
			  `imgguid` varchar(50) DEFAULT NULL,
			  `reviewuserguid` varchar(50) DEFAULT NULL,
			  `reviewusername` varchar(50) DEFAULT NULL,
			  `handlestatus` varchar(10) DEFAULT NULL,
			  `reviewtime` datetime DEFAULT NULL,
			  `handletime` datetime DEFAULT NULL,
			  PRIMARY KEY (`rowguid`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_redlight')<1
     then
            CREATE TABLE `cockpit_redlight` (
			  `rowguid` varchar(50) NOT NULL,
			  `cockpitguid` varchar(50) DEFAULT NULL,
			  `status` int(11) DEFAULT NULL,
			  `createtime` datetime DEFAULT NULL,
			  `launchuserguid` varchar(50) DEFAULT NULL,
			  `responseuserguid` varchar(50) DEFAULT NULL,
			  `content` varchar(500) DEFAULT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_redlight_feedback')<1
     then
            CREATE TABLE `cockpit_redlight_feedback` (
			  `rowguid` varchar(50) NOT NULL,
			  `redlightguid` varchar(50) DEFAULT NULL,
			  `feedbacktype` int(11) DEFAULT NULL,
			  `feedbackuserguid` varchar(50) DEFAULT NULL,
			  `feedbackusertype` int(11) DEFAULT NULL,
			  `feedbacktime` datetime DEFAULT NULL,
			  `content` varchar(500) DEFAULT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
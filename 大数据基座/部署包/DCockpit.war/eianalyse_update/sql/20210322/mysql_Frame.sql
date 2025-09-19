drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_monitor')<1
     then 
     	CREATE TABLE `cockpit_monitor` (
		  `rowguid` varchar(50) NOT NULL,
		  `userguid` varchar(50) DEFAULT NULL,
		  `projectguid` varchar(50) DEFAULT NULL,
		  `createtime` datetime DEFAULT NULL,
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
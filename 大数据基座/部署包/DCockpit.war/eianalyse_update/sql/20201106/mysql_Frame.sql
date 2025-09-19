drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_apply')<1
     then
CREATE TABLE `cockpit_norm_apply` (
  `rowguid` varchar(50) NOT NULL,
  `applyuserguid` varchar(50) DEFAULT NULL,
  `applyouguid` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `reason` text,
  `operatedate` date DEFAULT NULL,
  `pviguid` varchar(50) DEFAULT NULL,
  `applyusername` varchar(50) DEFAULT NULL,
  `normguid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='isOpen')<1
     then
            ALTER TABLE cockpit_norm ADD COLUMN isOpen VARCHAR(10);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
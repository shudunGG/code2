drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_result_history' )<1
     then 
     	CREATE TABLE `cockpit_norm_result_history` (
          `RowGuid` varchar(50) NOT NULL,
          `OperateDate` datetime DEFAULT NULL,
          `NormGuid` varchar(50) DEFAULT NULL,
          `FieldCount` int(11) DEFAULT NULL,
          `FieldDim` varchar(50) DEFAULT NULL,
          `FieldTimewindow` varchar(50) DEFAULT NULL,
          `ouGuid` varchar(50) DEFAULT NULL,
          `sortNum` int(11) DEFAULT NULL,
          `batchGuid` varchar(50) DEFAULT NULL,
          PRIMARY KEY (`RowGuid`),
          KEY `IX_NormGuid` (`NormGuid`),
          KEY `IX_FieldCount` (`FieldCount`),
          KEY `IX_FieldTimewindow` (`FieldTimewindow`),
          KEY `IX_FieldDim` (`FieldDim`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_result' and column_name='batchGuid')<1
     then 
        ALTER TABLE cockpit_norm_result ADD batchGuid varchar(50);
	end if;    
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_job_log' and column_name='batchGuid')<1
     then
         ALTER TABLE cockpit_job_log ADD batchGuid varchar(50);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
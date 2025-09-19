drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project'  and column_name='projectType')<1
    then 
     	ALTER TABLE cockpit_project ADD projectType varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_result_history'  and column_name='historyVersion')<1
    then 
     	ALTER TABLE cockpit_norm_result_history ADD historyVersion varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_job_log'  and column_name='historyVersion')<1
    then 
     	ALTER TABLE cockpit_job_log ADD historyVersion varchar(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
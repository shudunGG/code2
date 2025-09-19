drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project'  and column_name='projectmode')<1
     then 
     	ALTER TABLE cockpit_project ADD projectmode varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_project ADD program varchar(200) DEFAULT NULL;
     	ALTER TABLE cockpit_project ADD externalLinks varchar(200) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
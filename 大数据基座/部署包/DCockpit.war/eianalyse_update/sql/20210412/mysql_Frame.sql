drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='columnGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add columnGuid varchar(50) DEFAULT NULL;
	end if;

    if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='projectCateGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add projectCateGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='projectGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add projectGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='plateGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add plateGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='cardCateGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add cardCateGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_redlight'  and column_name='cardGuid')<1
    then 
    	ALTER TABLE cockpit_redlight add cardGuid varchar(50) DEFAULT NULL;
	end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
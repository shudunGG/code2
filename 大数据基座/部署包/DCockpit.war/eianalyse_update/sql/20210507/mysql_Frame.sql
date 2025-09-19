drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='cockpitguid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add cockpitguid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='columnGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add columnGuid varchar(50) DEFAULT NULL;
	end if;

    if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='projectCateGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add projectCateGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='projectGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add projectGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='plateGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add plateGuid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='cardCateGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add cardCateGuid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='normguid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add normguid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_feedback_norm'  and column_name='cardGuid')<1
    then 
    	ALTER TABLE cockpit_feedback_norm add cardGuid varchar(50) DEFAULT NULL;
	end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
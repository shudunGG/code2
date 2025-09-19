drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='previousguid')<1
    then 
     	ALTER TABLE cockpit_norm ADD previousguid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='belongouguid')<1
    then 
     	ALTER TABLE cockpit_norm ADD belongouguid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_set'  and column_name='previousguid')<1
    then 
     	ALTER TABLE cockpit_norm_set ADD previousguid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_apply'  and column_name='setguid')<1
    then 
     	ALTER TABLE cockpit_norm_apply ADD setguid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_apply'  and column_name='toouguid')<1
    then 
     	ALTER TABLE cockpit_norm_apply ADD toouguid varchar(50) DEFAULT NULL;
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_norm'  and column_name='label')<1
    then 
     	ALTER TABLE cockpit_card_norm ADD label varchar(100) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
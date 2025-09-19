drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_normdomain'  and column_name='apicode')<1
    then 
     	ALTER TABLE cockpit_normdomain add apicode varchar(50) DEFAULT NULL;
		ALTER TABLE cockpit_normdomain add isopen varchar(10) DEFAULT NULL;
		ALTER TABLE cockpit_normdomain add CreateTime datetime DEFAULT NULL;
		ALTER TABLE cockpit_normdomain add CreateUserGuid varchar(50) DEFAULT NULL;
		ALTER TABLE cockpit_normdomain add belongouguid varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_apply'  and column_name='normnum')<1
    then 
     	ALTER TABLE cockpit_norm_apply add normnum varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='phone')<1
    then 
     	ALTER TABLE cockpit_norm add phone varchar(50) DEFAULT NULL;
		ALTER TABLE cockpit_norm add isapifilter varchar(10) DEFAULT NULL;
		ALTER TABLE cockpit_norm add baseouguid varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='businessexplain')<1
    then 
     	ALTER TABLE cockpit_norm add businessexplain varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='normSourceBasis')<1
    then 
     	ALTER TABLE cockpit_norm add normSourceBasis varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='sharetype')<1
    then 
     	ALTER TABLE cockpit_norm add sharetype varchar(50) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm'  and column_name='safelevel')<1
    then 
     	ALTER TABLE cockpit_norm add safelevel varchar(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
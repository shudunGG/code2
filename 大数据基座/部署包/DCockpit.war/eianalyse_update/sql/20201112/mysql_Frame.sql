drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='apiguid')<1
     then 
     	ALTER TABLE cockpit_norm ADD apiguid varchar(100) NULL;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='apiparams')<1
     then 
     	ALTER TABLE cockpit_norm ADD apiparams TEXT NULL;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='apifilter')<1
     then 
     	ALTER TABLE cockpit_norm ADD apifilter TEXT NULL;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='matchmap')<1
     then 
     	ALTER TABLE cockpit_norm ADD matchmap varchar(100) NULL;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='apiresult')<1
     then 
     	ALTER TABLE cockpit_norm ADD apiresult TEXT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
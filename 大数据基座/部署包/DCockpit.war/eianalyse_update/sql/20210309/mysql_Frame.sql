drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_apicate'  and column_name='userguid')<1
     then 
     	alter table cockpit_apicate add userguid varchar(50);
	end if;
	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_apicate'  and column_name='ouguid')<1
     then 
     	ALTER TABLE cockpit_apicate ADD ouguid VARCHAR(50);
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
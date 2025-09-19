drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin	
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_result' and column_name='fielddim3')<1
     then
            alter table cockpit_norm_result add column fielddim3 varchar(255) null;
     end if;
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_result' and column_name='fielddim4')<1
     then
            alter table cockpit_norm_result add column fielddim4 varchar(255) null;
     end if;
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_result' and column_name='fielddim5')<1
     then
            alter table cockpit_norm_result add column fielddim5 varchar(255) null;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
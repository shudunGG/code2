drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name='maintag')<1
     then
            ALTER TABLE portrait_entity ADD maintag varchar(100) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name='subtag')<1
     then
     ALTER TABLE portrait_entity ADD subtag varchar(500) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name='is_shown')<1
     then
ALTER TABLE portrait_entity ADD is_shown BOOL NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name='picture')<1
     then
ALTER TABLE portrait_entity ADD picture varchar(100) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_entity' and column_name='detailaddress')<1
     then
ALTER TABLE portrait_entity ADD detailaddress varchar(100) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_plate_column' and column_name='status')<1
     then
ALTER TABLE cockpit_plate_column ADD status varchar(10) DEFAULT 1 NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_plate' and column_name='status')<1
     then
ALTER TABLE cockpit_plate ADD status varchar(10) DEFAULT 1 NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_result' and column_name='sortnum')<1
     then
ALTER TABLE cockpit_norm_result ADD sortnum int(11) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_log' and column_name='cardguid')<1
     then
ALTER TABLE cockpit_norm_log ADD cardguid varchar(100) NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
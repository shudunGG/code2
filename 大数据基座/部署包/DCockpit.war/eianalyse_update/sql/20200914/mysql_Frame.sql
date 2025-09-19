drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='rightControl')<1
     then
            ALTER TABLE cockpit_norm add rightControl varchar(5) DEFAULT '0';
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='rightControlField')<1
     then
            ALTER TABLE cockpit_norm add rightControlField varchar(50) DEFAULT NULL;
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='rightControlFieldNameEn')<1
     then
            ALTER TABLE cockpit_norm add rightControlFieldNameEn varchar(50) DEFAULT NULL;
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='rightControlFieldFieldNameCn')<1
     then
            ALTER TABLE cockpit_norm add rightControlFieldFieldNameCn varchar(50) DEFAULT NULL;
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm_result' and column_name='ouGuid')<1
     then
            ALTER TABLE cockpit_norm_result add ouGuid varchar(50) DEFAULT NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
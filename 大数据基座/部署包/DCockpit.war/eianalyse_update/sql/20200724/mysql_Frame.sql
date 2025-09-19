drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='ThemeGuid')>0
     then
            alter table cockpit_card drop column ThemeGuid;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='CardDataApi')>0
     then
            alter table cockpit_card drop column CardDataApi;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='CardDataRequestParam')>0
     then
            alter table cockpit_card drop column CardDataRequestParam;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='cardcolor')<1
     then
            alter table cockpit_card add column cardcolor varchar(50);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
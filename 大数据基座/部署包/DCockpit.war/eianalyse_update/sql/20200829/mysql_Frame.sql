drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataFieldGuid')>0
     then
            ALTER TABLE cockpit_norm modify DataFieldGuid text DEFAULT NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
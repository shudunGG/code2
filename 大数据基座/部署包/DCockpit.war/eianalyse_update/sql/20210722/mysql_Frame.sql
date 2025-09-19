drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_detail'  and column_name='belongouguid')<1
    then 
     	ALTER TABLE cockpit_info_detail add belongouguid varchar(50) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_category'  and column_name='belongouguid')<1
    then 
     	ALTER TABLE cockpit_info_category add belongouguid varchar(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
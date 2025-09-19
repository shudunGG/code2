drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_mobile_card'  and column_name='cardareasummary')<1
    then 
     	ALTER TABLE cockpit_mobile_card ADD cardareasummary text DEFAULT NULL;
     	ALTER TABLE cockpit_mobile_card ADD process varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_mobile_card ADD liableperson varchar(100) DEFAULT NULL;
	end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
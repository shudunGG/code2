drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_template_js'  and column_name='DetailIcon')<1
    then 
     	ALTER TABLE cockpit_card_template_js ADD DetailIcon varchar(255) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_template_js'  and column_name='normlist')<1
    then 
     	ALTER TABLE cockpit_card_template_js ADD normlist text DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_template_js'  and column_name='descnum')<1
    then 
     	ALTER TABLE cockpit_card_template_js ADD descnum int(11) DEFAULT NULL;
	end if;

	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_template_js'  and column_name='normnum')<1
    then 
     	ALTER TABLE cockpit_card_template_js ADD normnum int(11) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
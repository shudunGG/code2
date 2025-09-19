drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm_notes'  and column_name='cockpitGuid')<1
    then 
     	ALTER TABLE cockpit_norm_notes ADD cockpitGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD columnGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD projectCateGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD projectGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD plateGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD cardCateGuid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_norm_notes ADD cardGuid varchar(50) DEFAULT NULL;
	end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
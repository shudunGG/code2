drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin

     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project'  and column_name='remark')>0
     then 
     	ALTER TABLE cockpit_project MODIFY remark text;
	end if;

     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_column'  and column_name='remark')>0
     then 
     	ALTER TABLE cockpit_column MODIFY remark text;
	end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
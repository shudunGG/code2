drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_relation' and column_name='reverse_relation_name')<1
     then 
     	ALTER TABLE portrait_relation ADD reverse_relation_name varchar(50) NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
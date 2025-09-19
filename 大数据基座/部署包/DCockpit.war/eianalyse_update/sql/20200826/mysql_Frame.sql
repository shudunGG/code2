drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='isPublic')<1
     then
            alter table cockpit_card add column isPublic varchar(5) default 'false';
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_plate' and column_name='isPublic')<1
     then
            alter table cockpit_plate add column isPublic varchar(5) default 'false';
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_plate_cate' and column_name='isPublic')<1
     then
            alter table cockpit_plate_cate add column isPublic varchar(5) default 'false';
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
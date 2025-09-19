drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'annotation_task' and column_name='pictype')<1
     then
            ALTER TABLE annotation_task add pictype varchar(50) DEFAULT NULL;
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'annotation_task' and column_name='labelcodeitem')<1
     then
            ALTER TABLE annotation_task add labelcodeitem varchar(50) DEFAULT NULL;
     end if;
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'annotation_task' and column_name='createtime')<1
     then
            ALTER TABLE annotation_task add createtime datetime DEFAULT NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
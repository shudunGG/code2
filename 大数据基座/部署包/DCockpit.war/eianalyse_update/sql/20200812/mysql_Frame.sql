drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataFieldNameCN')>0
     then
            ALTER TABLE cockpit_norm modify DataFieldNameCN text DEFAULT NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataFieldNameEN')>0
     then
            ALTER TABLE cockpit_norm modify DataFieldNameEN text DEFAULT NULL;
     end if;
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataTableNameCN2')>0
     then
            ALTER TABLE cockpit_norm drop DataTableNameCN2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataTableNameEN2')>0
     then
            ALTER TABLE cockpit_norm drop DataTableNameEN2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datatableguid2')>0
     then
            ALTER TABLE cockpit_norm drop datatableguid2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldguid2')>0
     then
            ALTER TABLE cockpit_norm drop datafieldguid2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldnamecn2')>0
     then
            ALTER TABLE cockpit_norm drop datafieldnamecn2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldnameen2')>0
     then
            ALTER TABLE cockpit_norm drop datafieldnameen2;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='statisticsCycle')<1
     then
            ALTER TABLE cockpit_norm add statisticsCycle varchar(5) DEFAULT NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='isCumsum')<1
     then
            ALTER TABLE cockpit_norm add isCumsum varchar(5) DEFAULT NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='resultCount')<1
     then
            ALTER TABLE cockpit_norm add resultCount int(11) DEFAULT null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='sortOrder')<1
     then
            ALTER TABLE cockpit_norm add sortOrder varchar(10) DEFAULT NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
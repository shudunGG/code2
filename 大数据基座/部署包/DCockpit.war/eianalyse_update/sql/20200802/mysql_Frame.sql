drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='liableperguid')<1
     then
            ALTER TABLE cockpit_card ADD liableperguid varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='leaderguid')<1
     then
            ALTER TABLE cockpit_card ADD leaderguid varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='groupleaderguid')<1
     then
            ALTER TABLE cockpit_card ADD groupleaderguid varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='deputygroupleaderguid')<1
     then
            ALTER TABLE cockpit_card ADD deputygroupleaderguid varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='liableouguid')<1
     then
            ALTER TABLE cockpit_card ADD liableouguid varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='groupmemberguids')<1
     then
            ALTER TABLE cockpit_card ADD groupmemberguids text NULL;
     end if;
     
     
     
     
     
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dimtableguid2')<1
     then
            ALTER TABLE cockpit_norm ADD dimtableguid2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DimTableNameCN2')<1
     then
            ALTER TABLE cockpit_norm ADD DimTableNameCN2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DimTableNameEN2')<1
     then
            ALTER TABLE cockpit_norm ADD DimTableNameEN2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dimfieldguid2')<1
     then
            ALTER TABLE cockpit_norm ADD dimfieldguid2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dimfieldnamecn2')<1
     then
            ALTER TABLE cockpit_norm ADD dimfieldnamecn2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dimfieldnameen2')<1
     then
            ALTER TABLE cockpit_norm ADD dimfieldnameen2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='liableperson')<1
     then
            ALTER TABLE cockpit_norm ADD liableperson varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='liableou')<1
     then
            ALTER TABLE cockpit_norm ADD liableou varchar(50) NULL;
     end if;
      if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datasourcesys')<1
     then
            ALTER TABLE cockpit_norm ADD datasourcesys varchar(50) NULL;
     end if;
      if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datasourceid')<1
     then
            ALTER TABLE cockpit_norm ADD datasourceid varchar(50) NULL;
     end if;
      if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dimdatasourceid')<1
     then
            ALTER TABLE cockpit_norm ADD dimdatasourceid varchar(50) NULL;
     end if;
      if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='configtype')<1
     then
            ALTER TABLE cockpit_norm ADD configtype varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataTableNameCN2')<1
     then
            ALTER TABLE cockpit_norm ADD DataTableNameCN2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='DataTableNameEN2')<1
     then
            ALTER TABLE cockpit_norm ADD DataTableNameEN2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datatableguid2')<1
     then
            ALTER TABLE cockpit_norm ADD datatableguid2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldguid2')<1
     then
            ALTER TABLE cockpit_norm ADD datafieldguid2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldnamecn2')<1
     then
            ALTER TABLE cockpit_norm ADD datafieldnamecn2 varchar(50) NULL;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='datafieldnameen2')<1
     then
            ALTER TABLE cockpit_norm ADD datafieldnameen2 varchar(50) NULL;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
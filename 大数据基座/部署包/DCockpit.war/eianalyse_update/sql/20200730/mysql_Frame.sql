-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='subscribeCount')<1
     then
		ALTER TABLE cockpit_card ADD column subscribeCount decimal(18,0) DEFAULT 0;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='forwardCount')<1
     then
		ALTER TABLE cockpit_card ADD column forwardCount decimal(18,0) DEFAULT 0;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='searchCount')<1
     then
		ALTER TABLE cockpit_card ADD column searchCount decimal(18,0) DEFAULT 0;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card' and column_name='accessCount')<1
     then
		ALTER TABLE cockpit_card ADD column accessCount decimal(18,0) DEFAULT 0;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
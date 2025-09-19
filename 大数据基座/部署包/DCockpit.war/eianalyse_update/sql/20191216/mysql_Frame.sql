-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'PORTRAIT_TAGS' and column_name='IS_CLEAR')<1 then
ALTER TABLE PORTRAIT_TAGS ADD IS_CLEAR VARCHAR(2);
end if;
if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'PORTRAIT_TAGS' and column_name='HAS_HISTORY')<1 then
ALTER TABLE PORTRAIT_TAGS ADD HAS_HISTORY VARCHAR(2);
end if;
if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'PORTRAIT_TAGS' and column_name='TIME_TO_LIVE')<1 then
ALTER TABLE PORTRAIT_TAGS ADD TIME_TO_LIVE INTEGER;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
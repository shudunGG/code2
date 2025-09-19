-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
    if (SELECT count(1) from code_items where codeid='1015757' and itemvalue='001002')>0 then
    delete from code_items where codeid='1015757' and itemvalue='001002';
    end if;
    if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'metadata_datasource')>0 then
    DROP TABLE metadata_datasource;
    end if;
    if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'metadata_tablebasicinfo')>0 then
    DROP TABLE metadata_tablebasicinfo;
    end if;
    if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'metadata_tablestruct')>0 then
    DROP TABLE metadata_tablestruct;
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_manageinfo' and column_name='portraitsubject')>0 then
    ALTER TABLE portrait_manageinfo MODIFY COLUMN portraitsubject VARCHAR(2000);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_manageinfo' and column_name='serviceaddress')>0 then
    ALTER TABLE portrait_manageinfo MODIFY COLUMN serviceaddress VARCHAR(255);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_manageinfo' and column_name='hbaseaddress')>0 then
    ALTER TABLE portrait_manageinfo MODIFY COLUMN hbaseaddress VARCHAR(255);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
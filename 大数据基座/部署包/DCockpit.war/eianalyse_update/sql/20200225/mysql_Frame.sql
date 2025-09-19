-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_manageinfo' and column_name='serviceaddress') >0 then
    ALTER TABLE portrait_manageinfo MODIFY COLUMN serviceaddress VARCHAR(255);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_manageinfo' and column_name='portraitsubject') >0 then
    ALTER TABLE portrait_manageinfo MODIFY COLUMN portraitsubject VARCHAR(500);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_module' and column_name='modeltype') <1 then
    ALTER TABLE eia_module ADD COLUMN modeltype VARCHAR(10);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_module' and column_name='xxljobid') <1 then
    ALTER TABLE eia_module ADD COLUMN xxljobid VARCHAR(50);
    end if;
    if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'portrait_tags' and column_name='tags_table') >0 then
    ALTER TABLE portrait_tags MODIFY COLUMN tags_table VARCHAR(255) null;
    end if;
    if (select count(*) from code_main WHERE CODEID='1015770' AND CODENAME='图库分类') <1 then
    INSERT INTO `code_main` (`CODEID`, `CODENAME`, `LEVNUM`, `CATEGORYNUM`, `description`, `isfromsoa`, `baseouguid`) VALUES ('1015770', '图库分类', NULL, '', NULL, NULL, NULL);
    end if;
    if (select count(*) from code_items WHERE itemid='222791' AND itemtext='图库类') <1 then
    INSERT INTO `code_items` (`itemid`, `itemtext`, `ITEMVALUE`, `ITEMLEVCODE`, `CODEID`, `ORDERNO`, `DMABR1`, `DMABR2`, `INPABR`, `INPFRQ`, `YESPRV`, `DMHND`, `FULLTEXT`) VALUES ('222791', '图库类', '004', '004', '1015757', '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
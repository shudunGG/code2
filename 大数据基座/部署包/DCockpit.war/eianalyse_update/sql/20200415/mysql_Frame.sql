-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'datasource' AND COLUMN_NAME='belongOuGuid')<1 then
    alter table datasource add COLUMN belongOuGuid VARCHAR(50) ;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'datasource' AND COLUMN_NAME='enablingOuGuid')<1 then
    alter table datasource add COLUMN enablingOuGuid text DEFAULT NULL;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'datasource' AND COLUMN_NAME='isOpen')<1 then
    alter table datasource add COLUMN isOpen VARCHAR(10) DEFAULT 'false' ;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'portrait_tags' AND COLUMN_NAME='belongOuGuid')<1 then
    alter table portrait_tags add COLUMN belongOuGuid VARCHAR(50) ;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'portrait_tags' AND COLUMN_NAME='enablingOuGuid')<1 then
    alter table portrait_tags add COLUMN enablingOuGuid text DEFAULT NULL;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'portrait_table' AND COLUMN_NAME='belongOuGuid')<1 then
    alter table portrait_table add COLUMN belongOuGuid VARCHAR(50) ;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'portrait_table' AND COLUMN_NAME='enablingOuGuid')<1 then
    alter table portrait_table add COLUMN enablingOuGuid text DEFAULT NULL;
    end if;
    if (SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'portrait_entity' AND COLUMN_NAME='belongOuGuid')<1 then
    alter table portrait_entity add COLUMN belongOuGuid VARCHAR(50) ;
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
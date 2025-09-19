-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists `epoint_proc_alter`;
GO
    create procedure `epoint_proc_alter`() begin if(
        select
            count(*)
        from
            information_schema.columns
        where
            TABLE_SCHEMA = DATABASE()
            and TABLE_NAME = 'eia_module'
            and COLUMN_NAME = 'name'
    ) > 0 then
alter table
    eia_module
modify
    column name varchar(150);
end if;
end;
GO
    call epoint_proc_alter();
GO
    drop procedure if exists `epoint_proc_alter`;
GO
    -- DELIMITER ; --
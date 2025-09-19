-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/24 【时间】
--  EpointsformListVersion（列表版本表）添加字段formguid -- 薛炳


-- EpointsformListVersion（列表版本表）添加字段formguid
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'EpointsformListVersion' and column_name = 'formguid') then
    alter table EpointsformListVersion add column formguid nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
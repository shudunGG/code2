-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/07/24--【薛炳】

-- 修改table_basicinfo表mergeformids字段类型改为longtext
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'table_basicinfo' and column_name = 'mergeformids' and data_type = 'longtext') then
    alter table table_basicinfo modify  mergeformids longtext;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_tablerelation' and column_name = 'businesstableid' and data_type = 'longtext') then
    alter table epointsform_tablerelation modify  businesstableid longtext;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- DELIMITER ; --
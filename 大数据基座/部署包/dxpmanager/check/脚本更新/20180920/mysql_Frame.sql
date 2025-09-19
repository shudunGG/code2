-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/09/20 
-- 修改原类型为text大字段无必要性的字段为varchar(2000) --季立霞

-- 修改epointsform_table_basicinfo中bak1字段类型
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_table_basicinfo' and column_name = 'bak1') then 
    alter table epointsform_table_basicinfo modify column bak1 varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改epointsform_table_struct中bak1字段类型
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_table_struct' and column_name = 'bak1') then 
    alter table epointsform_table_struct modify column bak1 varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
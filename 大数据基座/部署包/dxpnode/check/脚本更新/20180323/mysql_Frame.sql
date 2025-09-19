-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/03/23

-- 基础信息表添加表控件英文字段创建方式字段，manual手动，其余是自动  --季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsform_table_basicinfo' and column_name = 'ctrlencreatetype') then
    alter table epointsform_table_basicinfo add column ctrlencreatetype varchar(12);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
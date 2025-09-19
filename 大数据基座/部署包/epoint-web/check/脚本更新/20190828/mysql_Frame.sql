-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/08/28【时间】
-- api_info表删除字段timeoutInMilliseconds --【俞俊男】


-- 删除字段timeoutInMilliseconds
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'timeoutInMilliseconds') then
    alter table api_info drop column timeoutInMilliseconds;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
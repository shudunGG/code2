-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/09/26 【时间】
-- 添加表api_runtime_log添加字段consumerguid --【俞俊男】

-- 添加consumerId字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_log' and column_name = 'consumerguid') then
    alter table api_runtime_log add column consumerguid nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/13【时间】
-- 删除表api_runtime_alert_rule字段 type字段 --【陈端一】


drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_runtime_alert_rule' and column_name = 'type') then 
    alter table api_runtime_alert_rule drop COLUMN type;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- FRAME_COMMISSIONSET_HANDLE 增加title字段 --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'FRAME_COMMISSIONSET_HANDLE' and column_name = 'title') then
    alter table FRAME_COMMISSIONSET_HANDLE add column title nvarchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
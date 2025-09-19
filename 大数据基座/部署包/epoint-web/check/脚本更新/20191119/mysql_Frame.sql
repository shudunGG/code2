-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/11/19 【时间】
-- api_runtime_statistics_consumerday 表名改为 api_runtime_statistics_csmday  --【俞俊男】
-- api_runtime_statistics_apiminutes 表名改为 api_runtime_statistics_apimin  --【俞俊男】
-- api_runtime_statistics_consumerminutes 表名改为 api_runtime_statistics_csmmin  --【俞俊男】

-- api_runtime_statistics_consumerday 表名改为 api_runtime_statistics_csmday
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns where table_schema = database() and table_name = 'api_runtime_statistics_consumerday') then 
    ALTER TABLE api_runtime_statistics_consumerday RENAME TO api_runtime_statistics_csmday;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- api_runtime_statistics_apiminutes 表名改为 api_runtime_statistics_apimin
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns where table_schema = database() and table_name = 'api_runtime_statistics_apiminutes') then 
    ALTER TABLE api_runtime_statistics_apiminutes RENAME TO api_runtime_statistics_apimin;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- api_runtime_statistics_consumerminutes 表名改为 api_runtime_statistics_csmmin
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns where table_schema = database() and table_name = 'api_runtime_statistics_consumerminutes') then 
    ALTER TABLE api_runtime_statistics_consumerminutes RENAME TO api_runtime_statistics_csmmin;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
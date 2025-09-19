-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/17 【时间】
-- 【新增经办表，相关参数表新增描述字段】 --【季海英】

-- 添加表

create table  if not exists workflow_handle_info(
            handleguid 	nvarchar(100) not null primary key,
            processguid 	nvarchar(100) null,
            processversionguid 	nvarchar(100) null,
            pviguid 	nvarchar(100) null,
            misrowguid 	nvarchar(100) null,
            tableid 	int(11) null,
            userguid 	nvarchar(100) null,
            ouguid 	nvarchar(100) null,
            baseouguid 	nvarchar(100) null,
            lasthandletime 	datetime null,
            status 	nvarchar(100) null,
            isdone 	nvarchar(100) null,
            note 	nvarchar(100) null
);

GO


-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_method_parameter' and column_name = 'mpnamedescription') then
    alter table workflow_method_parameter add column mpnamedescription nvarchar(100);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_method_parameter' and column_name = 'mpvaluedescription') then
    alter table workflow_method_parameter add column mpvaluedescription nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



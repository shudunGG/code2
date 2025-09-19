-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- COMM_MESSAGE_REMIND_INFO表targetusername，targetuserguid字段改为Text
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'COMM_MESSAGE_REMIND_INFO' and column_name = 'targetuserguid' and data_type = 'text') then
    alter table COMM_MESSAGE_REMIND_INFO modify  targetuserguid text;
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'COMM_MESSAGE_REMIND_INFO' and column_name = 'targetusername' and data_type = 'text') then
    alter table COMM_MESSAGE_REMIND_INFO modify  targetusername text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
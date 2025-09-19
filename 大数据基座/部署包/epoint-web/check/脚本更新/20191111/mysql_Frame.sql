-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019-11-11
-- 【修改用户表的密码字段长度】 --【cdy】
-- 【修改用户快照表的密码字段长度】 --【cdy】
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user' and column_name = 'password'  and data_type = 'varchar' and character_maximum_length=500) then
	alter table frame_user modify password varchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_snapshot' and column_name = 'password'  and data_type = 'varchar' and character_maximum_length=500) then
	alter table frame_user_snapshot modify password varchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改workflow_process的字段类型
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'workflow_process' and column_name = 'processname' and data_type = 'varchar') then
    alter table workflow_process modify  processname varchar(2000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
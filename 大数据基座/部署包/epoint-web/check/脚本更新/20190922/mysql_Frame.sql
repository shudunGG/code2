-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/09/23【时间】
 
-- api_channel_upstream字段upstream_encode_name改为1500长度 --cdy

drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'upstream_encode_name' and data_type = 'varchar' and character_maximum_length=1500) then
    alter table api_channel_upstream modify column upstream_encode_name varchar(1500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
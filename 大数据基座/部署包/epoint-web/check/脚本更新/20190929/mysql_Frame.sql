-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/9/29 
-- 【api_channel_upstream中添加pingurl字段】 --【cdy】

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'pingurl') then
    alter table api_channel_upstream add column pingurl varchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'httptype') then
    alter table api_channel_upstream add column httptype varchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'httpcode') then
    alter table api_channel_upstream add column httpcode varchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'rise') then
    alter table api_channel_upstream add column rise int;
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'failcount') then
    alter table api_channel_upstream add column failcount int;
end if;


if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'connectTimeout') then
    alter table api_channel_upstream add column connectTimeout int;
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'readTimeout') then
    alter table api_channel_upstream add column readTimeout int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
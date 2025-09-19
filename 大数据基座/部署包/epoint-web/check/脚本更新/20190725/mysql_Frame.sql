-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/7/25 【时间】
-- 【高可用通道】 --cdy

-- 添加表
create table if not exists api_channel_upstream
(
  row_guid       varchar(50) not null primary key,
  order_number    int,
  upstream_name   varchar(100),
  upstream_encode_name   varchar(500),
  create_date     datetime,
  update_date     datetime
);
GO


-- 添加表
create table if not exists api_channel_target
(
  row_guid    varchar(50) not null primary key,
  weight      int,
  target_host varchar(100),
  upstream_guid varchar(50),
  create_date     datetime,
  update_date     datetime
);
GO


drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_target' and column_name = 'targetid') then
    alter table api_channel_target add column targetid varchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'upstreamid') then
    alter table api_channel_upstream add column upstreamid varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/12/17
-- 徐剑

-- app_info添加issyncuserconfig字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'issyncuserconfig') then
    alter table app_info add column issyncuserconfig int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加app_userconfig_relation
create table if not exists app_userconfig_relation
(
  rowguid        nvarchar(50) not null primary key,
  appguid        nvarchar(50),
  configname     nvarchar(100)
);
GO

-- 添加frame_userconfig_snapshot
create table if not exists frame_userconfig_snapshot
(
  rowguid             nvarchar(50) not null primary key,
  userconfigguid      nvarchar(100),
  belonguserguid      nvarchar(100),
  configname          nvarchar(100),
  configvalue         nvarchar(500),
  configguid          nvarchar(100),
  updatetime          datetime,
  appkey              nvarchar(50),
  clientip            nvarchar(50)
);
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/09/17 【时间】

-- 添加打开方式字段 --周志豪
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_type' and column_name = 'opentype') then
    alter table messages_type add column opentype nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 消息订阅表
-- 添加表
create table if not exists Message_subscribe
(
  rowguid              nvarchar(50) not null primary key,
  appguid              nvarchar(50),
  subscribeguid        nvarchar(50),
  subscribetype        nvarchar(50)
);
GO


-- DELIMITER ; --
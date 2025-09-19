-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/31
-- 插入系统参数和流程代理人两条数据  --陈星怡

-- 插入系统参数
drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from  app_sync_subscribe where clienttag = 'FrameConfig') then
 insert into app_sync_subscribe (rowguid,clienttag,clientname,subscribepage) values ('696e27b3-4e09-450d-8eb1-60a1c904178b', 'FrameConfig', '系统参数', 'frame/pages/basic/gateway/app/appinfomanage/subscribeframeconfig');
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO

-- 插入流程代理人
drop procedure if exists`epoint_proc_insert`;
GO
create  procedure `epoint_proc_insert`()
begin
if not exists (select 1 from  app_sync_subscribe where clienttag = 'FrameCommissionSet') then
 insert into app_sync_subscribe (rowguid,clienttag,clientname) values ('9ab7ce5c-6908-4e48-b738-b7381fd6474e', 'FrameCommissionSet', '流程代理人');
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists `epoint_proc_insert`;
GO


-- 添加表frame_operateratelimit_log   --吴琦
create table if not exists frame_operateratelimit_log (
  RowGuid varchar(50) NOT NULL,
  lockurl varchar(500) DEFAULT NULL,
  locktype varchar(50) DEFAULT NULL,
  lockvalue varchar(50) DEFAULT NULL,
  locktime datetime DEFAULT NULL,
  clearlocktime datetime DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- 表单版本表增加布局类型字段 --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointformversion' and column_name = 'layouttype') then
    alter table epointformversion add column layouttype varchar(10);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
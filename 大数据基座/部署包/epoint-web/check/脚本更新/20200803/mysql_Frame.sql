-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/8/3
-- 新增日志数据库表frame_logconfig,frame_log表新增appkey字段  -- 陈星怡

-- 新增表frame_logconfig
create table if not exists frame_logconfig
(
  sysguid                       nvarchar(100) primary key not null,
  attach_connectionstringname   nvarchar(100),
  attach_connectionstring       text,
  isnowuse                      int,
  ordernum                      int,
  databasetype                  nvarchar(100)
);
GO


-- frame_log表新增appkey字段
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_log' and column_name = 'appkey') then
    alter table frame_log add column appkey nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
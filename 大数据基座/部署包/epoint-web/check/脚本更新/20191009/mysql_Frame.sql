-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/10/09 【时间】
-- 【内容简单介绍】 --樊志君

 -- 去掉frame_mybook_snapshot或者frame_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
-- 去掉FRAME_MYADDRESSBOOK 表的OBJECTTYPE字段默认值; 
-- 修改frame_secretlevel_snapshot主键为rowguid
-- 由于表名长度限制，将部分快照表名字重命名
-- frame_accountrelation_snapshot重命名为frame_ar_snapshot
-- frame_myaddressbook_snapshot重命名为frame_mybook_snapshot
-- frame_myaddressgroup_snapshot重命名frame_mygroup_snapshot
-- frame_secretlevel_snapshot重命名frame_seclevel_snapshot
-- 添加appcode字段 
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
	
alter table FRAME_MYADDRESSBOOK alter OBJECTTYPE  drop default;

 -- 去掉frame_mybook_snapshot或者frame_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
if exists (select 1 from information_schema.tables where table_schema = database() and table_name='frame_myaddressbook_snapshot') then
  alter table frame_myaddressbook_snapshot alter OBJECTTYPE  drop default;
else
alter table frame_mybook_snapshot alter OBJECTTYPE  drop default;
end if;
	
if exists (select 1 from information_schema.tables where table_schema = database() and table_name='frame_accountrelation_snapshot') then
  alter table frame_accountrelation_snapshot rename as frame_ar_snapshot;
end if;

if exists (select 1 from information_schema.tables where table_schema = database() and table_name='frame_myaddressbook_snapshot') then
  alter table frame_myaddressbook_snapshot rename as frame_mybook_snapshot;
end if;


if exists (select 1 from information_schema.tables where table_schema = database() and table_name='frame_myaddressgroup_snapshot') then
  alter table frame_myaddressgroup_snapshot rename as frame_mygroup_snapshot;
end if;

if exists (select 1 from information_schema.tables where table_schema = database() and table_name='frame_secretlevel_snapshot') then
  alter table frame_secretlevel_snapshot rename as frame_seclevel_snapshot;
end if;


if not exists (SELECT null FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE table_schema = database() and  table_name='frame_seclevel_snapshot' AND constraint_name='PRIMARY' and column_name='rowguid') then
	truncate table  frame_seclevel_snapshot;
	alter table frame_seclevel_snapshot DROP PRIMARY KEY ,ADD PRIMARY KEY (rowguid);
end if;
	
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_info' and column_name = 'appcode') then
    alter table app_info add column appcode nvarchar(50);
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
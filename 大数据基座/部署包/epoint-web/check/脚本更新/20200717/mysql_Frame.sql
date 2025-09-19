-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/07/17 
-- 新增隐私类型表 --王颜
create table if not exists frame_privacy_type
(
  rowguid              nvarchar(50) not null primary key,
  privacytype              nvarchar(50),
  privacydetail           nvarchar(100),
  isdefault           int
);
GO

-- 隐私版本表添加隐私类型
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_privacy' and column_name = 'privacytype') then
    alter table frame_privacy add column privacytype nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
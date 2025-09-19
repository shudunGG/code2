-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/16 【时间】
-- frame_ou（部门表）添加字段OUCODEFULL -- 俞俊男
-- 新增门户元件分类表/frame_componenttype -- 俞俊男
-- 门户元件表[frame_portal_element]添加字段componenttype、moreurl -- 俞俊男

-- 新增门户元件分类表 
create table if not exists frame_componenttype (
  rowguid varchar(50) not null primary key,
  typename varchar(50),
  ordernum int(11)
);
GO

-- 门户元件表[frame_portal_element]添加字段componenttype
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_element' and column_name = 'componenttype') then
    alter table frame_portal_element add column componenttype int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 门户元件表[frame_portal_element]添加字段moreurl
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_portal_element' and column_name = 'moreurl') then
    alter table frame_portal_element add column moreurl varchar(1000);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- frame_ou（部门表）添加字段OUCODEFULL
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou' and column_name = 'OUCODEFULL') then
    alter table frame_ou add column OUCODEFULL nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
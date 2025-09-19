-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/05【时间】
-- api_info表添加字段wsNameSpace、wsSoapActio、wsWsdlContent --【俞俊男】


-- 添加字段wsNameSpace
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'wsNameSpace') then
    alter table api_info add column wsNameSpace nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- api_request_params表中添加position -- 王颜
drop procedure if exists`epoint_proc_alter`;
GO
create procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_request_params' and column_name = 'position') then
    alter table api_request_params add column position nvarchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段wsSoapAction
drop procedure if exists`epoint_proc_alter`;
GO
create procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'wsSoapAction') then
    alter table api_info add column wsSoapAction nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 添加字段wsWsdlContent
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'api_info' and column_name = 'wsWsdlContent') then
    alter table api_info add column wsWsdlContent text;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
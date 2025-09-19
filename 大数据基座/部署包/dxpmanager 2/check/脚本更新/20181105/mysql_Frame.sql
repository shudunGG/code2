-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/11/05 

-- 修改sso_token_info 表的字段名称--俞俊男

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'sso_token_info' and column_name = 'type') then 
    alter table sso_token_info change type tokentype varchar(50);   
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改frame_ou_weixin 表的字段名称--周志豪

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou_weixin' and column_name = 'id') then 
    alter table frame_ou_weixin change id rowguid int(8);   
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
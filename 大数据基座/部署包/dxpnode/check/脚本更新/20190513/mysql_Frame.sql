-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/05/13【时间】
-- 删除表appmanage_publicelement字段 --【陈端一】


drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'TitleFieldName') then 
    alter table appmanage_publicelement drop COLUMN TitleFieldName;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'YFieldName') then 
    alter table appmanage_publicelement drop COLUMN YFieldName;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'XFieldName') then 
    alter table appmanage_publicelement drop COLUMN XFieldName;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'IsDisable') then 
    alter table appmanage_publicelement drop COLUMN IsDisable;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'ChartType') then 
    alter table appmanage_publicelement drop COLUMN ChartType;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'GridShowField') then 
    alter table appmanage_publicelement drop COLUMN GridShowField;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'IconStore') then 
    alter table appmanage_publicelement drop COLUMN IconStore;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'PortaletType') then 
    alter table appmanage_publicelement drop COLUMN PortaletType;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'SSOUrl') then 
    alter table appmanage_publicelement drop COLUMN SSOUrl;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'MoreButtonLinkUrl') then 
    alter table appmanage_publicelement drop COLUMN MoreButtonLinkUrl;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'appmanage_publicelement' and column_name = 'AllowMoreButton') then 
    alter table appmanage_publicelement drop COLUMN AllowMoreButton;
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
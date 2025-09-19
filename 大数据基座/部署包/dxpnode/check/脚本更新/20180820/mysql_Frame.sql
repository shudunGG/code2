-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/06/29
-- messages_waitsend增加字段,解决带发表消息无法收回的问题--何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier') then
    alter table messages_waitsend add column clientidentifier nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier2') then
    alter table messages_waitsend add column clientidentifier2 nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier3') then
    alter table messages_waitsend add column clientidentifier3 nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier4') then
    alter table messages_waitsend add column clientidentifier4 nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier5') then
    alter table messages_waitsend add column clientidentifier5 nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'clientidentifier6') then
    alter table messages_waitsend add column clientidentifier6 nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'typeguid') then
    alter table messages_waitsend add column typeguid nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'appkey') then
    alter table messages_waitsend add column appkey nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_waitsend' and column_name = 'targetuserid') then
    alter table messages_waitsend add column targetuserid nvarchar(50);
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
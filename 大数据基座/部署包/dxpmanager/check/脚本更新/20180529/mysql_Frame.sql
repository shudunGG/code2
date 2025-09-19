-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/5/29 
-- 新增字段用来 区分消息类型--【何晓瑜】
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_center' and column_name = 'messagesremindtype') then
    alter table messages_center add messagesremindtype nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_center_histroy' and column_name = 'messagesremindtype') then
    alter table messages_center_histroy add messagesremindtype nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_type' and column_name = 'relatedfield') then
    alter table messages_type add relatedfield nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_type' and column_name = 'relatedvalue') then
   alter table messages_type add relatedvalue nvarchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2018/09/06
-- 消息表增加一个移动端是否需要提醒字段  --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
where table_schema = database() and table_name = 'messages_message' and column_name = 'isnoneedmobileremind') then
alter table messages_message add column isnoneedmobileremind int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
where table_schema = database() and table_name = 'messages_messagehistory' and column_name = 'isnoneedmobileremind') then
alter table messages_messagehistory add column isnoneedmobileremind int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
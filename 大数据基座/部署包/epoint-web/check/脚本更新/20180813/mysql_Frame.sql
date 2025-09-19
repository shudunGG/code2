-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/08/013
-- -- 如果personal_portal_element没有rowguid,删表重构---何晓瑜

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'personal_portal_element' and column_name = 'rowguid') then
    drop table if exists personal_portal_element;
    create table if not exists personal_portal_element
(
        ptrowguid          varchar(50) not null,
        isDisable            int(11),
        userguid            varchar(50) not null,
        elementlocation varchar(50),
        rowguid             varchar(50) not null primary key
);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
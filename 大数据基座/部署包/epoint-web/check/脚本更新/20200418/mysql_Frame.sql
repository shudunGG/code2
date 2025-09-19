-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/4/18
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user' and column_name = 'framemj') then
    alter table frame_user add column framemj int(11) default 0;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(*) num from portrait_entity where belongOuGuid is null or belongOuGuid='')>0
     then
        update datasource set belongOuGuid='9579bbf9-31d0-4548-b78f-ea4392bf68f9' where belongOuGuid is null or belongOuGuid='';
        update portrait_tags set belongOuGuid='9579bbf9-31d0-4548-b78f-ea4392bf68f9' where belongOuGuid is null or belongOuGuid='';
        update portrait_table set belongOuGuid='9579bbf9-31d0-4548-b78f-ea4392bf68f9' where belongOuGuid is null or belongOuGuid='';
        update portrait_entity set belongOuGuid='9579bbf9-31d0-4548-b78f-ea4392bf68f9' where belongOuGuid is null or belongOuGuid='';
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
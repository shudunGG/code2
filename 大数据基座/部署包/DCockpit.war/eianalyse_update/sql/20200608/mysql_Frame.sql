drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='指标类型' where ci.itemtext='人工标签')
     then
        delete  from  code_items  where itemid='222275' and codeid='1015706';
        delete from code_items where itemid='222711' and codeid='1015706';
        delete from code_items where itemid='222712' and codeid='1015706';
        update code_items set itemtext='规则' where itemtext='基础标签' and codeid='1015706';
        update code_items set itemtext='主键' where itemtext='主键标签' and codeid='1015706';
        update code_items set itemtext='sql' where itemtext='SQL标签' and codeid='1015706';
        update code_items set itemtext='人工' where itemtext='人工标签' and codeid='1015706';
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
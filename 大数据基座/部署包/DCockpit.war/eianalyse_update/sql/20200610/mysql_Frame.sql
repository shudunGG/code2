drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='标签值类型' where ci.itemtext='二值')
     then
        delete from code_items  where itemid=222714;
     end if;
     if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='标签值类型' where ci.itemtext='多值')
     then
        update code_items set itemtext='多值标签' where itemid=222714;
     end if;
      if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='标签值类型' where ci.itemtext='动态')
     then
        update code_items set itemtext='动态标签' where itemid=222715;
     end if;
      if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='标签值类型' where ci.itemtext='集合')
     then
        update code_items set itemtext='集合标签' where itemid=222716;
     end if;
      if  exists (select * from code_items ci inner join code_main cm on ci.CODEID=cm.CODEID and cm.CODENAME='标签值类型' where ci.itemtext='仅值')
     then
        update code_items set itemtext='值标签' where itemid=222726;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
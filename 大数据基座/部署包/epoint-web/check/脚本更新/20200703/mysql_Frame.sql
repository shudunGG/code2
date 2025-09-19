-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO 
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
   if exists (select *  from information_schema.columns where table_schema = database() and table_name='messages_rule' and COLUMN_NAME='contentlegth') then 
      alter table messages_rule change  column contentlegth contentlength int;
end if;
end;
GO
call epoint_proc_alter();
GO


-- DELIMITER ; --
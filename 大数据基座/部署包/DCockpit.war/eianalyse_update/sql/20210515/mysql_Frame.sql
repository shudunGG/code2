drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM information_schema.statistics WHERE TABLE_SCHEMA = DATABASE ( ) AND table_name = 'messages_waitsend' AND index_name = 'idx_targetuserid')<1
	then 
		alter table messages_waitsend add index idx_targetuserid (targetuserid);
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_card_template_js')<1
     then 
     	CREATE TABLE `cockpit_card_template_js` (
  		`rowguid` varchar(50) DEFAULT NULL,
  		`ChartName` varchar(50) DEFAULT NULL,
  		`ChartIcon` varchar(50) DEFAULT NULL,
  		`smallprogramid` varchar(50) DEFAULT NULL,
  		`remark` text,
  		`OrderNum` int(11) DEFAULT NULL,
  		`paramter` text,
  		`status` varchar(10) DEFAULT '1'
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
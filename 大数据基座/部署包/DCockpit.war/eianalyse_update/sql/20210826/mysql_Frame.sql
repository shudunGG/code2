drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_info_detail_review')<1
     then
            CREATE TABLE `index_model_attach` (
  			`rowguid` varchar(50) DEFAULT NULL,
  			`name` varchar(255) DEFAULT NULL,
 			 `publishtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  			`remark` varchar(255) DEFAULT NULL,
  			`attachguid` varchar(50) DEFAULT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
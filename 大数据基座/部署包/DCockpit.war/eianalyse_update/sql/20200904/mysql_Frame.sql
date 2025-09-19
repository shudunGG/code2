-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'epoint_job_manager_config')<1
     then
		CREATE TABLE epoint_job_manager_config (
		  rowguid varchar(50) NOT NULL,
		  configname varchar(100) NOT NULL COMMENT '配置名',
		  configvalue varchar(512) DEFAULT NULL COMMENT '配置值',
		  PRIMARY KEY (rowguid)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- DELIMITER ; --
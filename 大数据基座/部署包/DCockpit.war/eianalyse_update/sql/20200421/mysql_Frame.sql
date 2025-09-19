-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists `epoint_proc_alter`;
GO
	create procedure `epoint_proc_alter`() begin if (
		select
			count(*)
		from
			information_schema.TABLES
		where
			TABLE_SCHEMA = DATABASE()
			and TABLE_NAME = 'livy_session_active_record'
	) < 1 then CREATE TABLE livy_session_active_record (
		rowguid VARCHAR (50) NOT NULL,
		livySessionId VARCHAR (50) DEFAULT NULL,
		heartbeatTime datetime DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (rowguid)
	) ENGINE = INNODB DEFAULT CHARSET = utf8mb4;
end if;
end;
GO
	call epoint_proc_alter();
GO
	drop procedure if exists `epoint_proc_alter`;
GO
	-- DELIMITER ; --
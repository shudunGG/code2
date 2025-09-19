drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'datasourceextendinfo' )<1
     then 
     	CREATE TABLE `datasourceextendinfo` (
  		`rowguid` varchar(50)  NOT NULL,
  		`datasourceid` int(11) NOT NULL,
  		`ouguid` varchar(50) DEFAULT NULL,
 		`nodeguid` varchar(50)  DEFAULT NULL,
  		`contype` varchar(10)  DEFAULT NULL,
  		`schemaname` varchar(100)  DEFAULT NULL,
  		`zookeeperhostname` varchar(200)  DEFAULT NULL,
  		`zookeeperpath` varchar(200)  DEFAULT NULL,
  		`encode` varchar(50)  DEFAULT NULL,
  		`principal` varchar(100) DEFAULT NULL,
  		`keytabattachguid` varchar(50) DEFAULT NULL,
  		`debeziumapiurl` varchar(255) DEFAULT NULL,
  		PRIMARY KEY (`rowguid`),
  		KEY `datasourceid` (`datasourceid`) USING BTREE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	 if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_detail' and column_name='istop')<1
     then 
        ALTER TABLE cockpit_info_detail ADD istop VARCHAR(10) DEFAULT 0;
	end if;    
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_info_detail' and column_name='isrecommend')<1
     then 
        ALTER TABLE cockpit_info_detail ADD isrecommend VARCHAR(10) DEFAULT 0;
	end if;    
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit')<1
     then
CREATE TABLE `cockpit` (
  `rowguid` varchar(100) NOT NULL,
  `cockpitname` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `createuser` varchar(100) DEFAULT NULL,
  `createou` varchar(100) DEFAULT NULL,
  `createtime` varchar(100) DEFAULT NULL,
  `watermark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_column')<1
     then
CREATE TABLE `cockpit_column` (
  `rowguid` varchar(100) NOT NULL,
  `apicode` varchar(100) DEFAULT NULL,
  `createuser` varchar(100) DEFAULT NULL,
  `createou` varchar(100) DEFAULT NULL,
  `createtime` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `ordernum` int(11) DEFAULT NULL,
  `columnname` varchar(100) DEFAULT NULL,
  `cockpitguid` varchar(100) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
  if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project')<1
     then
CREATE TABLE `cockpit_project` (
  `rowguid` varchar(100) NOT NULL,
  `apicode` varchar(100) DEFAULT NULL,
  `createuser` varchar(100) DEFAULT NULL,
  `createou` varchar(100) DEFAULT NULL,
  `createtime` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `ordernum` int(11) DEFAULT NULL,
  `projectname` varchar(100) DEFAULT NULL,
  `cockpitguid` varchar(100) DEFAULT NULL,
  `columnguid` varchar(100) DEFAULT NULL,
  `projectcateguid` varchar(100) DEFAULT NULL,
  `sourcetype` varchar(100) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `screen` text DEFAULT NULL,
  `ispublic` varchar(100) DEFAULT NULL,
  `liableperson` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `normsetguid` text  DEFAULT NULL,
  `normguid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
  if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project_cate')<1
     then
CREATE TABLE `cockpit_project_cate` (
  `rowguid` varchar(100) NOT NULL,
  `projectcatename` varchar(100) DEFAULT NULL,
  `columnguid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;	
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
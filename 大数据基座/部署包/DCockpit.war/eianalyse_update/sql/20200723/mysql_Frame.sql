drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm_result')<1
     then
            CREATE TABLE IF NOT EXISTS cockpit_norm_result (
		        RowGuid varchar(50) NOT NULL,
		        OperateDate datetime DEFAULT NULL,
		        NormGuid varchar(50) DEFAULT NULL,
		        FieldCount int(11) DEFAULT NULL,
		        FieldDim varchar(50) DEFAULT NULL,
		        FieldTimewindow varchar(50) DEFAULT NULL,
		        normtype varchar(5) DEFAULT NULL,
				fielddim2 varchar(255) DEFAULT NULL,
				resultjson text DEFAULT NULL,
		        PRIMARY KEY (RowGuid),
		        KEY IX_NormGuid (NormGuid),
		        KEY IX_FieldCount (FieldCount),
		        KEY IX_FieldTimewindow (FieldTimewindow),
		        KEY IX_FieldDim (FieldDim)
	        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_warning_result')<1
     then
            CREATE TABLE IF NOT EXISTS cockpit_warning_result ( 
		         RowGuid varchar(50) NOT NULL, 
		         NormGuid varchar(50) DEFAULT NULL, 
		         WarningruleGuid varchar(50) DEFAULT NULL, 
		         ComputeGuid varchar(50) DEFAULT NULL, 
		         UserGuid varchar(50) DEFAULT NULL, 
		         WarningTime datetime DEFAULT NULL, 
		         Reason varchar(500) DEFAULT NULL, 
		         IsHistory varchar(10) DEFAULT NULL, 
		         IsSend varchar(10) DEFAULT NULL, 
		         PRIMARY KEY (RowGuid), 
		         KEY IX_NormGuid (NormGuid), 
		         KEY IX_WarningruleGuid (WarningruleGuid), 
		         KEY IX_UserGuid (UserGuid), 
		         KEY IX_IsHistory (IsHistory)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_supervise')<1
     then
            CREATE TABLE `cockpit_supervise` (
			  `rowguid` varchar(50) NOT NULL,
			  `cockpitguid` varchar(50) DEFAULT NULL COMMENT '卡片guid',
			  `supervisename` varchar(50) DEFAULT NULL COMMENT '督办名称',
			  `status` int(11) DEFAULT NULL COMMENT '状态',
			  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
			  `launchuserguid` varchar(50) DEFAULT NULL COMMENT '发起人',
			  `responseuserguid` varchar(50) DEFAULT NULL COMMENT '责任人',
			  `starttime` datetime DEFAULT NULL COMMENT '开始时间',
			  `endtime` datetime DEFAULT NULL COMMENT '结束时间',
			  `content` varchar(500) DEFAULT NULL COMMENT '红灯指示',
			  `screenshot` text COMMENT '卡片截图',
			  PRIMARY KEY (`rowguid`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_supervise_feeedback')<1
     then
            CREATE TABLE `cockpit_supervise_feeedback` (
			  `rowguid` varchar(50) NOT NULL,
			  `superviseguid` varchar(50) DEFAULT NULL COMMENT '督办guid',
			  `feeedbackuserguid` varchar(50) DEFAULT NULL COMMENT '反馈人',
			  `feeedbackusertype` int(11) DEFAULT NULL COMMENT '反馈人类别',
			  `feeedbacktime` datetime DEFAULT NULL COMMENT '反馈时间',
			  `content` varchar(500) DEFAULT NULL COMMENT '反馈内容',
			  PRIMARY KEY (`rowguid`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_supervise_process')<1
     then
            CREATE TABLE `cockpit_supervise_process` (
			  `rowguid` varchar(50) NOT NULL,
			  `superviseguid` varchar(50) DEFAULT NULL,
			  `handletype` int(11) DEFAULT NULL,
			  `handletime` datetime DEFAULT NULL,
			  `handleusertype` int(11) DEFAULT NULL,
			  `handleuserguid` varchar(50) DEFAULT NULL,
			  `handleouguid` varchar(50) DEFAULT NULL,
			  `olddeadline` datetime DEFAULT NULL,
			  `newdeadline` datetime DEFAULT NULL,
			  `delayreason` varchar(500) DEFAULT NULL,
			  `delayresult` int(11) DEFAULT NULL,
			  `coordinateresult` varchar(500) DEFAULT NULL,
			  `content` varchar(500) DEFAULT NULL,
			  PRIMARY KEY (`rowguid`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.tables WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_card_theme')>0
     then
            drop table cockpit_card_theme;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='UpdateFrequency')>0
     then
            alter table cockpit_norm drop column UpdateFrequency;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_warningrule' and column_name='warningFrequency')>0
     then
            alter table cockpit_warningrule drop column warningFrequency;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='tasktiming')<1
     then
            alter table cockpit_norm add column tasktiming varchar(5) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='intervalseconds')<1
     then
            alter table cockpit_norm add column intervalseconds varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='intervalminutes')<1
     then
            alter table cockpit_norm add column intervalminutes varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='hour')<1
     then
            alter table cockpit_norm add column hour varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='minutes')<1
     then
            alter table cockpit_norm add column minutes varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='weekday')<1
     then
            alter table cockpit_norm add column weekday varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='dayofmonth')<1
     then
            alter table cockpit_norm add column dayofmonth varchar(50) null;
     end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'cockpit_norm' and column_name='xxljobid')<1
     then
            alter table cockpit_norm add column xxljobid varchar(50) null;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
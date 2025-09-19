drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_card')<1
     then
				CREATE TABLE `cockpit_card` (
					`RowGuid` varchar(50) NOT NULL,
					`NormDomain` varchar(10) DEFAULT NULL,
					`CardName` varchar(50) DEFAULT NULL,
					`CardType` varchar(50) DEFAULT NULL,
					`CardDataApi` text,
					`CardDataRequestParam` text,
					`TemplateGuid` varchar(50) DEFAULT NULL,
					`ThemeGuid` varchar(50) DEFAULT NULL,
					`CardPreviewUrl` text,
					`Remark` text,
					`OrderNum` int(11) DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_card_norm')<1
     then
				CREATE TABLE `cockpit_card_norm` (
					`RowGuid` varchar(50) NOT NULL,
					`CardGuid` varchar(50) DEFAULT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;

		 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_card_template')<1
     then
				CREATE TABLE `cockpit_card_template` (
					`RowGuid` varchar(50) NOT NULL,
					`ChartName` varchar(50) DEFAULT NULL,
					`ChartIcon` text,
					`SingleNormCount` int(11) DEFAULT '0',
					`SeveralNormCount` int(11) DEFAULT '0',
					`Remark` text,
					`OrderNum` int(11) DEFAULT NULL,
					`UseCount` int(11) DEFAULT '0',
					`ChartPreviewUrl` text,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm')<1
     then
		  	 CREATE TABLE `cockpit_norm` (
					`RowGuid` varchar(50) NOT NULL,
					`NormDomain` varchar(10) DEFAULT NULL,
					`NormName` varchar(100) DEFAULT NULL,
					`NormType` varchar(50) DEFAULT NULL,
					`LastUpdateTime` datetime DEFAULT NULL,
					`Status` varchar(10) DEFAULT NULL,
					`Remark` longtext,
					`DataTableGuid` varchar(50) DEFAULT NULL,
					`DataFieldGuid` varchar(50) DEFAULT NULL,
					`DataFieldNameCN` varchar(50) DEFAULT NULL,
					`DataFieldNameEN` varchar(50) DEFAULT NULL,
					`GroupbyType` varchar(50) DEFAULT NULL,
					`TimeFieldGuid` varchar(50) DEFAULT NULL,
					`DimTableGuid` varchar(50) DEFAULT NULL,
					`DimFieldGuid` varchar(50) DEFAULT NULL,
					`DimFieldNameCN` varchar(50) DEFAULT NULL,
					`DimFieldNameEN` varchar(50) DEFAULT NULL,
					`RelateList` longtext,
					`FilterList` longtext,
					`GenerateSql` longtext,
					`TimeWindow` varchar(10) DEFAULT NULL,
					`NormBoid` varchar(50) DEFAULT NULL,
					`NormUrl` varchar(50) DEFAULT NULL,
					`NormChartType` varchar(50) DEFAULT NULL,
					`DataTableNameCN` varchar(50) DEFAULT NULL,
					`DataTableNameEN` varchar(50) DEFAULT NULL,
					`DimTableNameCN` varchar(50) DEFAULT NULL,
					`DimTableNameEN` varchar(50) DEFAULT NULL,
					`IsNeedWarning` varchar(10) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL,
					`CreateTime` datetime DEFAULT NULL,
					`CreateUserGuid` varchar(50) DEFAULT NULL,
					`SubscribeCount` int(11) DEFAULT '0',
					`CollectCount` int(11) DEFAULT '0',
					`LikeCount` int(11) DEFAULT '0',
					`ShareCount` int(11) DEFAULT '0',
					`CommentCount` int(11) DEFAULT '0',
					`SearchCount` int(11) DEFAULT '0',
					`DetailCount` int(11) DEFAULT '0',
					`TimeFieldNameCN` varchar(50) DEFAULT NULL,
					`TimeFieldNameEN` varchar(50) DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm_comment')<1
     then
				CREATE TABLE `cockpit_norm_comment` (
					`RowGuid` varchar(50) NOT NULL,
					`OperateDate` datetime DEFAULT NULL,
					`UserGuid` varchar(50) DEFAULT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`IsOpen` varchar(10) DEFAULT '0',
					`Content` text,
					`Feedback` text,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm_log')<1
     then
				CREATE TABLE `cockpit_norm_log` (
					`RowGuid` varchar(50) DEFAULT NULL,
					`OperateDate` datetime DEFAULT NULL,
					`PlateGuid` varchar(50) DEFAULT NULL,
					`PlateName` varchar(50) DEFAULT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`NormName` varchar(50) DEFAULT NULL,
					`Userguid` varchar(50) DEFAULT NULL,
					`OperateType` varchar(10) DEFAULT NULL
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm_noright')<1
     then
					CREATE TABLE `cockpit_norm_noright` (
						`RowGuid` varchar(50) NOT NULL,
						`UserGuid` varchar(50) DEFAULT NULL,
						`NormGuid` varchar(50) DEFAULT NULL,
						PRIMARY KEY (`RowGuid`)
					) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;

		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_norm_operate')<1
     then
				CREATE TABLE `cockpit_norm_operate` (
					`RowGuid` varchar(50) NOT NULL,
					`OperateDate` datetime DEFAULT NULL,
					`UserGuid` varchar(50) DEFAULT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`IsSubscribe` varchar(10) DEFAULT '0',
					`IsCollect` varchar(10) DEFAULT '0',
					`IsLike` varchar(10) DEFAULT '0',
					`UserName` varchar(50) DEFAULT NULL,
					`cardguid` varchar(50) DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_normdomain')<1
     then
				CREATE TABLE `cockpit_normdomain` (
					`Rowguid` varchar(50) NOT NULL,
					`NormdomainNum` varchar(50) DEFAULT NULL,
					`NormdomainName` varchar(50) DEFAULT NULL,
					`Description` varchar(500) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL,
					PRIMARY KEY (`Rowguid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;

		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate')<1
     then
				CREATE TABLE `cockpit_plate` (
					`RowGuid` varchar(50) DEFAULT NULL,
					`ColumnGuid` varchar(50) DEFAULT NULL,
					`PlateName` varchar(50) DEFAULT NULL,
					`PlateType` varchar(10) DEFAULT NULL,
					`PlateIcon` text,
					`OrderNum` int(11) DEFAULT NULL,
					`PlateUrl` text,
					`Remark` text,
					`RoleGuids` text
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate_cate')<1
     then
				CREATE TABLE `cockpit_plate_cate` (
					`RowGuid` varchar(50) NOT NULL,
					`PlateGuid` varchar(50) DEFAULT NULL,
					`CateName` varchar(50) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL,
					`Status` varchar(10) DEFAULT NULL,
					`CateCode` varchar(100) DEFAULT NULL,
					`UserGuids` text,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate_cate_card')<1
     then
				CREATE TABLE `cockpit_plate_cate_card` (
					`RowGuid` varchar(50) NOT NULL,
					`PlateGuid` varchar(50) DEFAULT NULL,
					`CateGuid` varchar(50) DEFAULT NULL,
					`CateName` varchar(50) DEFAULT NULL,
					`CardGuid` varchar(50) DEFAULT NULL,
					`CardName` varchar(50) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate_cate_norm')<1
     then
				CREATE TABLE `cockpit_plate_cate_norm` (
					`RowGuid` varchar(50) DEFAULT NULL,
					`PlateGuid` varchar(50) DEFAULT NULL,
					`CateGuid` varchar(50) DEFAULT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`NormName` varchar(50) DEFAULT NULL,
					`OrderNum` int(11) DEFAULT NULL
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate_column')<1
     then
				CREATE TABLE `cockpit_plate_column` (
					`RowGuid` varchar(50) NOT NULL,
					`ColumnName` varchar(50) DEFAULT NULL,
					`ColumnIcon` text,
					`ColumnUrl` text,
					`OrderNum` int(11) DEFAULT NULL,
					`Remark` text,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_plate_noright')<1
     then
						CREATE TABLE `cockpit_plate_noright` (
							`RowGuid` varchar(50) DEFAULT NULL,
							`UserGuid` varchar(50) DEFAULT NULL,
							`PlateGuid` varchar(50) DEFAULT NULL
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		  	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_warningrule')<1
     then
				CREATE TABLE `cockpit_warningrule` (
					`RowGuid` varchar(50) NOT NULL,
					`NormGuid` varchar(50) DEFAULT NULL,
					`RuleName` varchar(100) DEFAULT NULL,
					`WarningType` varchar(10) DEFAULT NULL,
					`Status` varchar(10) DEFAULT NULL,
					`WarningFrequency` varchar(10) DEFAULT NULL,
					`LastWarningTime` datetime DEFAULT NULL,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		  	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='cockpit_warningrule_compute')<1
     then
				CREATE TABLE `cockpit_warningrule_compute` (
					`RowGuid` varchar(50) NOT NULL,
					`WarningruleGuid` varchar(50) DEFAULT NULL,
					`FieldNameEN` varchar(50) DEFAULT NULL,
					`ComputeContent` longtext,
					`RoleGuids` longtext,
					`UserGuids` longtext,
					PRIMARY KEY (`RowGuid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
		  	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='mobile_cockpit_feedbackinfo')<1
     then
				CREATE TABLE `mobile_cockpit_feedbackinfo` (
					`rowguid` varchar(50) NOT NULL,
					`type` varchar(500) DEFAULT NULL,
					`userid` varchar(50) DEFAULT NULL,
					`feedBackInfo` varchar(500) DEFAULT NULL,
					`submit_time` datetime DEFAULT NULL,
					`tel` varchar(50) DEFAULT NULL,
					`status` varchar(255) DEFAULT NULL,
					`deal_time` datetime DEFAULT NULL,
					`deal_userid` varchar(50) DEFAULT NULL,
					`deal_opinion` varchar(500) DEFAULT NULL,
					`isreadopinion` varchar(5) DEFAULT NULL,
					`cardguid` varchar(50) DEFAULT NULL,
					PRIMARY KEY (`rowguid`)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
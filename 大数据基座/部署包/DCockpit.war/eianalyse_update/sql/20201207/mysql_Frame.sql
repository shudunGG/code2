drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
    if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_norm' and column_name='flowguid')<1
     then
     	ALTER TABLE cockpit_norm ADD flowguid varchar(50);
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'dxp_flow_info' )<1
     then 
     	CREATE TABLE `dxp_flow_info` (
          `rowguid` varchar(50) NOT NULL,
          `flowconfig` text,
          `flowattachguid` varchar(50) DEFAULT NULL,
          `flowtype` varchar(50) DEFAULT NULL,
          `nodeguid` varchar(50) DEFAULT NULL,
          `generatestatus` int(11) DEFAULT NULL,
          `publishstatus` int(11) DEFAULT NULL,
          `sourceouguid` varchar(50) DEFAULT NULL,
          `targetouguid` varchar(50) DEFAULT NULL,
          `flowname` varchar(255) DEFAULT NULL,
          `generatedate` datetime DEFAULT NULL,
          `operatedate` datetime DEFAULT NULL,
          `flowmd5` varchar(255) DEFAULT NULL,
          `xms` int(11) DEFAULT '0',
          `xmx` int(11) DEFAULT '0',
          `livyPath` varchar(100) DEFAULT NULL,
          `hdptype` varchar(100) DEFAULT NULL,
          `groupguid` varchar(50) DEFAULT NULL,
          `integrationtype` varchar(50) DEFAULT NULL,
          `fromdsid` int(11) DEFAULT NULL,
          `targetdsid` int(11) DEFAULT NULL,
          `subscribetype` varchar(10) DEFAULT NULL,
          `fromtable` varchar(200) DEFAULT NULL,
          `targettable` varchar(200) DEFAULT NULL,
          `groupid` varchar(200) DEFAULT NULL,
          `msmqtype` int(11) DEFAULT '0',
          `ouguid` varchar(50) DEFAULT NULL,
          `baseouguid` varchar(50) DEFAULT NULL,
          `hivedsid` int(11) DEFAULT NULL,
          `hivesql` text,
          `isdagchild` int(11) DEFAULT '0',
          `prestodsid` int(11) DEFAULT NULL,
          PRIMARY KEY (`rowguid`),
          KEY `sourceouguid` (`sourceouguid`) USING BTREE,
          KEY `targetougguid` (`targetouguid`) USING BTREE,
          KEY `subscribetype` (`subscribetype`) USING BTREE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'dxp_model_subassembly' )<1
     then
        CREATE TABLE `dxp_model_subassembly` (
          `rowguid` varchar(50) NOT NULL,
          `pluginname` varchar(200) DEFAULT NULL,
          `classpath` varchar(500) DEFAULT NULL,
          `iconsmall` varchar(500) DEFAULT NULL,
          `icon` varchar(500) DEFAULT NULL,
          `url` varchar(500) DEFAULT NULL,
          `groupguid` varchar(100) DEFAULT NULL,
          `orderNum` int(11) DEFAULT NULL,
          `maxOutputLinks` int(11) DEFAULT NULL,
          `maxInputLinks` int(11) DEFAULT NULL,
          `enable` int(11) DEFAULT NULL,
          `introduce` varchar(500) DEFAULT NULL,
          PRIMARY KEY (`rowguid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (SELECT count( 1 ) FROM dxp_model_subassembly)<1
     then
        insert  into `dxp_model_subassembly`(`rowguid`,`pluginname`,`classpath`,`iconsmall`,`icon`,`url`,`groupguid`,`orderNum`,`maxOutputLinks`,`maxInputLinks`,`enable`,`introduce`) values
        ('35501e0a-34a5-40cf-9a75-03b4e1ab10ab','列合并','com.epoint.dxp.development.model.flow.steps.ColumnUnionStep','images/add-icon/columnunion.png','images/icon/columnunion.png','dxp/datamodel/modelassembly/columnunion','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'列合并'),
        ('42ea0952-e732-4560-8628-8f7409fc9758','时间过滤','com.epoint.dxp.development.model.flow.steps.DateSubFilterStep','images/add-icon/datesubfilter.png','images/icon/datesubfilter.png','dxp/datamodel/modelassembly/datesubfilter','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'时间过滤'),
        ('4a3d6c97-58f6-4790-85a6-a609ddbbcd1b','字段联合','com.epoint.dxp.development.model.flow.steps.FieldUnionStep','images/add-icon/fieldunion.png','images/icon/fieldunion.png','dxp/datamodel/modelassembly/fieldunion','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,0,'字段联合'),
        ('4ecbe6d5-a479-4761-b4da-f28a922e410e','时间差','com.epoint.dxp.development.model.flow.steps.OneTableTimeDiffStep','images/add-icon/onetabletimediff.png','images/icon/onetabletimediff.png','dxp/datamodel/modelassembly/onetabletimediff','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'时间差'),
        ('66f58fb2-dc5e-491d-a741-65ae86997729','表关联','com.epoint.dxp.development.model.flow.steps.TableJoinStep','images/add-icon/tablejoin.png','images/icon/tablejoin.png','dxp/datamodel/modelassembly/tablejoin','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,2,1,'表关联'),
        ('7c7d6477-8dcf-4257-8a3f-b37e7e21faf2','去重','com.epoint.dxp.development.model.flow.steps.DeduplicationRowsStep','images/add-icon/deduplicaterows.png','images/icon/deduplicaterows.png','dxp/datamodel/modelassembly/deduplicaterows','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'去重'),
        ('9211b47c-568a-4088-9867-2d3c051d2563','重命名','com.epoint.dxp.development.model.flow.steps.RenameFieldStep','images/add-icon/renamefield.png','images/icon/renamefield.png','dxp/datamodel/modelassembly/renameField','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'重命名'),
        ('96556d7e-9acf-4e7b-a50b-4dcfcb9e091a','分组去重','com.epoint.dxp.development.model.flow.steps.GroupDeduplicateStep','images/add-icon/groupdeduplicate.png','images/icon/groupdeduplicate.png','dxp/datamodel/modelassembly/groupdeduplicate','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'分组去重'),
        ('aacc12ce-85ec-45ae-bcff-8dd84a300489','行筛选','com.epoint.dxp.development.model.flow.steps.FilterRowStep','images/add-icon/filterrows.png','images/icon/filterrows.png','dxp/datamodel/modelassembly/filterrows','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'行筛选'),
        ('bc73f5dc-7e2a-4ace-bab6-40352dd78644','分组','com.epoint.dxp.development.model.flow.steps.GroupByStep','images/add-icon/groupby.png','images/icon/groupby.png','dxp/datamodel/modelassembly/groupby','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'分组'),
        ('d816e5c8-c0d0-407e-984c-90f9f1467e99','获取当前时间','com.epoint.dxp.development.model.flow.steps.AddColumnCurrentTimeStep','images/add-icon/addcolumncurrenttime.png','images/icon/addcolumncurrenttime.png','dxp/datamodel/modelassembly/addcolumncurrenttime','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'获取当前时间'),
        ('da0ee6a9-e90b-46a7-bcb7-3cd377baa635','空值填充','com.epoint.dxp.development.model.flow.steps.EmptyFillStep','images/add-icon/emptyfill.png','images/icon/emptyfill.png','dxp/datamodel/modelassembly/emptyfill','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'空值填充'),
        ('e873e131-5fe6-4d50-a062-564682ed4930','排序','com.epoint.dxp.development.model.flow.steps.OrderByStep','images/add-icon/orderby.png','images/icon/orderby.png','dxp/datamodel/modelassembly/orderby','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'排序'),
        ('edaa9620-321f-4737-93c7-b21a304300b6','列新增','com.epoint.dxp.development.model.flow.steps.AddColumnStep','images/add-icon/addcolumn.png','images/icon/addcolumn.png','dxp/datamodel/modelassembly/addcolumn','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'列新增'),
        ('f072b387-7f63-4612-b75c-b59350a942e8','表合并','com.epoint.dxp.development.model.flow.steps.TableUnionStep','images/add-icon/tableunion.png','images/icon/tableunion.png','dxp/datamodel/modelassembly/tableunion','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,2,1,'表合并'),
        ('f42eac49-6fc6-4762-bd90-7f3ad9d663cb','列筛选','com.epoint.dxp.development.model.flow.steps.FilterColumnStep','images/add-icon/filtercolumn.png','images/icon/filtercolumn.png','dxp/datamodel/modelassembly/filtercolumn','b7d721e0-0325-479c-b6e5-50344fbd1010',0,NULL,1,1,'列筛选');
    end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'dxp_subassembly_group' )<1
     then
        CREATE TABLE `dxp_subassembly_group` (
          `rowguid` varchar(50) NOT NULL,
          `groupname` varchar(100) DEFAULT NULL,
          `typeicon` varchar(500) DEFAULT NULL,
          `plugintype` varchar(50) DEFAULT NULL,
          `orderNum` int(11) DEFAULT NULL,
          PRIMARY KEY (`rowguid`) USING BTREE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
     end if;
     if  (SELECT count( 1 ) FROM dxp_subassembly_group)<1
     then
        insert  into `dxp_subassembly_group`(`rowguid`,`groupname`,`typeicon`,`plugintype`,`orderNum`) values
        ('267e8944-52a7-4e37-8404-d1502b96901a','文件传输','images/add-icon/flow.png','job',180),
        ('2c700a9c-18c1-4674-a67f-b884d8ce499f','输出组件','images/add-icon/output.png','trans',90),
        ('30a1d2b6-062e-4efe-9142-f6e39a64c293','条件组件','images/add-icon/flow.png','job',190),
        ('480ee04d-0f7b-4170-80d6-4845a651837a','转换组件','images/add-icon/change.png','trans',80),
        ('60e1fc55-2a6a-437f-b977-f1d5f6d3ec19','查询组件','images/add-icon/interface.png','trans',60),
        ('9c7ae2c5-3a06-49a8-b6cf-88caf84148dc','脚本组件','images/add-icon/foot.png','trans',50),
        ('9dd9dd53-c646-482b-89af-180bb84d1cb1','可视组件','images/add-icon/view-group.png','model',50),
        ('b7d721e0-0325-479c-b6e5-50344fbd1010','数据组件','images/add-icon/data-group.png','model',100),
        ('c70c5849-ae73-4a4b-b8b2-23a7a00e7551','输入组件','images/add-icon/input.png','trans',100),
        ('d30a5f63-763d-48bd-ad72-2126b464d0b2','通用组件','images/add-icon/flow.png','job',200),
        ('e8c9f66d-1c52-4065-94dd-e26f2f6c2e39','应用组件','images/add-icon/flow.png','trans',70);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
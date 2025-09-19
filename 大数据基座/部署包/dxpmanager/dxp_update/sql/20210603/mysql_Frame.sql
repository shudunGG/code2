--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
ALTER TABLE dxp_model_subassembly ADD COLUMN modeltype VARCHAR(5);

GO

ALTER TABLE datasourceextendinfo ADD COLUMN clustername VARCHAR(500);

GO

ALTER TABLE datasourceextendinfo ADD COLUMN namenodes VARCHAR(200);

GO

ALTER TABLE datasourceextendinfo ADD COLUMN rpcaddress TEXT;

GO

ALTER TABLE DXP_MODEL_FLOW_INFO ADD COLUMN prestosql text;

GO

ALTER TABLE DXP_MODEL_FLOW_INFO ADD COLUMN dscribeinfo VARCHAR(1000);

GO

ALTER TABLE dxp_model_tableimportinfo ADD COLUMN tableType VARCHAR(100);

GO

ALTER TABLE dxp_model_tableimportinfo ADD COLUMN wherecondition VARCHAR(500);

GO

ALTER TABLE dxp_model_tableimportinfo ADD COLUMN chinesetablename VARCHAR(200);

GO

ALTER TABLE table_basicinfo ADD COLUMN modelguid VARCHAR(100);

GO

ALTER TABLE table_basicinfo ADD COLUMN flowguid VARCHAR(100);

GO

ALTER TABLE table_basicinfo ADD COLUMN outtype VARCHAR(10);

GO

ALTER TABLE dxp_model_flow_info ADD COLUMN ispublic VARCHAR(5) DEFAULT 0;

GO

ALTER TABLE dxp_model_flow_info ADD COLUMN userguid VARCHAR(50);

GO

update Frame_Module set ModuleUrl='dxp/datamodel/resourcemanager/importtablega' where ModuleGuid='18c1476d-3922-4782-8caa-043f0a0fb637'

GO

create table dxp_model_tableinforight(
	rowguid varchar(50) NOT NULL ,
	TABLEID VARCHAR(100),
	ALLOWTO VARCHAR(100),
	ALLOWType VARCHAR(100),
	PRIMARY KEY (`rowguid`),
	 KEY `IX_DXPMODEL_TABLERIGHT_ALL` (`ALLOWTO`) USING BTREE
);

GO

INSERT INTO `dxp_model_subassembly` (`rowguid`, `pluginname`, `classpath`, `iconsmall`, `icon`, `url`, `groupguid`, `orderNum`, `maxOutputLinks`, `maxInputLinks`, `enable`, `introduce`, `grouptype`, `modeltype`) VALUES ('fcc851cd-71ab-4fb3-98f2-3531d7af371a', '文本内容处理', 'com.epoint.dxp.development.model.flow.steps.KeyWordExtrationStep', 'images/add-icon/keywordextration.png', 'images/icon/keywordextration.png', 'dxp/datamodel/modelassembly/keywordextraction', 'b7d721e0-0325-479c-b6e5-50344fbd1010', 0, NULL, 1, 1, '文本内容处理', '1', '');

GO

create table dxp_model_special_subassembly(
	rowguid varchar(50) not null,
	name    varchar(100) not null,
	jsontemplate text    not null,
	ordernum   int  not null,
	PRIMARY KEY (`rowguid`)
);

GO

create table dxp_model_special_subassembly_parameter(
	rowguid varchar(50) not null,
	name    varchar(100) not null,
	chinesename varchar(200) ,
	assemblyguid varchar(50) not null,
	prompt   varchar(500),
	PRIMARY KEY (`rowguid`)
);

GO

insert into `dxp_model_subassembly` (`rowguid`, `pluginname`, `classpath`, `iconsmall`, `icon`, `url`, `groupguid`, `orderNum`, `maxOutputLinks`, `maxInputLinks`, `enable`, `introduce`, `grouptype`, `modeltype`) values('c1ebd548-94ef-4bc9-8ba6-17ef19d6615b','自定义行筛选','com.epoint.dxp.development.model.flow.steps.DiyFilterRowStep','images/add-icon/diyfilterrows.png','images/icon/diyfilterrows.png','dxp/datamodel/modelassembly/diyfilterrows','b7d721e0-0325-479c-b6e5-50344fbd1010','0',NULL,'1','1','自定义行筛选','1','');

GO

insert into `dxp_model_subassembly` (`rowguid`, `pluginname`, `classpath`, `iconsmall`, `icon`, `url`, `groupguid`, `orderNum`, `maxOutputLinks`, `maxInputLinks`, `enable`, `introduce`, `grouptype`, `modeltype`) values('6eb75ced-fde8-46c7-b041-94e99c7741ad','条件判断','com.epoint.dxp.development.model.flow.steps.CaseWhenStep','images/add-icon/numericalconversion.png','images/icon/numericalconversion.png','dxp/datamodel/modelassembly/casewhen','b7d721e0-0325-479c-b6e5-50344fbd1010','0',NULL,'1','1','条件判断','1','');

-- DELIMITER ; --
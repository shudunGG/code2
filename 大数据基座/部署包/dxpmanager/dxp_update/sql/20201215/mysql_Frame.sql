--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
ALTER TABLE table_basicinfo ADD COLUMN importtype INT;
ALTER TABLE table_basicinfo ADD COLUMN tableTypeGuid VARCHAR(50);
ALTER TABLE dxp_model_subassembly ADD COLUMN grouptype VARCHAR(5);
ALTER TABLE dxp_model_subassembly ADD COLUMN modeltype VARCHAR(5);
ALTER TABLE dxp_flow_info ADD COLUMN prestodsid int;
ALTER TABLE dxp_flow_info ADD COLUMN modelguid VARCHAR(50);
ALTER TABLE dxp_flow_info ADD COLUMN outputtype VARCHAR(50);

GO

CREATE TABLE `dxp_model_flow_info` (
  `rowguid` VARCHAR(50) NOT NULL,
  `flowconfig` mediumText,
  `flowattachguid` VARCHAR(50) DEFAULT NULL,
  `nodeguid` VARCHAR(50) DEFAULT NULL,
  `generatestatus` INT(11) DEFAULT NULL,
  `publishstatus` INT(11) DEFAULT NULL,
  `sourceouguid` VARCHAR(50) DEFAULT NULL,
  `targetouguid` VARCHAR(50) DEFAULT NULL,
  `flowname` VARCHAR(255) DEFAULT NULL,
  `generatedate` DATETIME DEFAULT NULL,
  `operatedate` DATETIME DEFAULT NULL,
  `flowmd5` VARCHAR(255) DEFAULT NULL,
  `xms` INT(11) DEFAULT '0',
  `xmx` INT(11) DEFAULT '0',
  `livyPath` VARCHAR(100) DEFAULT NULL,
  `hdptype` VARCHAR(100) DEFAULT NULL,
  `groupguid` VARCHAR(50) DEFAULT NULL,
  `fromdsid` INT(11) DEFAULT NULL,
  `targetdsid` INT(11) DEFAULT NULL,
  `subscribetype` VARCHAR(10) DEFAULT NULL,
  `fromtable` VARCHAR(200) DEFAULT NULL,
  `targettable` VARCHAR(200) DEFAULT NULL,
  `ouguid` VARCHAR(50) DEFAULT NULL,
  `baseouguid` VARCHAR(50) DEFAULT NULL,
  `hivedsid` INT(11) DEFAULT NULL,
  `prestodsid` INT(11) DEFAULT NULL,
  PRIMARY KEY (`rowguid`),
  KEY `sourceouguid` (`sourceouguid`) USING BTREE,
  KEY `targetougguid` (`targetouguid`) USING BTREE,
  KEY `subscribetype` (`subscribetype`) USING BTREE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4
-- DELIMITER ; --
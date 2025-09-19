--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

--添加任务关联表
CREATE TABLE `dxp_model_tableimportinfo` (
  `rowguid` varchar(50) NOT NULL,
  `flowconfig` text,
  `status` int(11) DEFAULT NULL,
  `importdate` datetime DEFAULT NULL,
  `operatedate` datetime DEFAULT NULL,
  `fromdsid` int(11) DEFAULT NULL,
  `targetdsid` int(11) DEFAULT NULL,
  `fromtable` varchar(200) DEFAULT NULL,
  `targettable` varchar(200) DEFAULT NULL,
  `tablecount` bigint(20) DEFAULT NULL,
  `userguid` varchar(100) DEFAULT NULL,
  `ouguid` varchar(50) DEFAULT NULL,
  `baseouguid` varchar(50) DEFAULT NULL,
  `type` int(1) DEFAULT NULL,
  `defaultFS` varchar(50) DEFAULT NULL,
  `nodeguid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- DELIMITER ; --
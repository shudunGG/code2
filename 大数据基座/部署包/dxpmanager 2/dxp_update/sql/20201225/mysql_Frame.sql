--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

CREATE TABLE `dxp_presto_hive_relate` (
  `rowguid` varchar(50) NOT NULL,
  `prestodsid` bigint(20) DEFAULT NULL,
  `hivedsid` bigint(20) DEFAULT NULL,
  `hdfsdsid` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

GO
-- DELIMITER ; --
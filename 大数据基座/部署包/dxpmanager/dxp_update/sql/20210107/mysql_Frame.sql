--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

CREATE TABLE `dxp_kafka_consume_group_relate` (
  `rowguid` varchar(50) CHARACTER SET utf8 NOT NULL,
  `topicguid` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `groupname` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `flowguid` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`rowguid`),
  KEY `topicguid` (`topicguid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

GO
-- DELIMITER ; --
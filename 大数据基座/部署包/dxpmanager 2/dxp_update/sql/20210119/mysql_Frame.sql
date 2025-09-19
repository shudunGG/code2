--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
CREATE TABLE `dxp_model_table_type` (
  `rowguid` varchar(50) NOT NULL,
  `typename` varchar(200) NOT NULL,
  `ordernum` int(11) DEFAULT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;

GO

CREATE TABLE `dxp_model_onlineusernum` (
  `Rowguid` varchar(50) NOT NULL,
  `monitorTime` datetime(6) DEFAULT NULL,
  `userNum` int(11) DEFAULT NULL,
  PRIMARY KEY (`Rowguid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;

GO

-- DELIMITER ; --
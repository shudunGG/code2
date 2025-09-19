--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
CREATE TABLE `dxp_guidemodel_step` (
  `rowguid` varchar(50) NOT NULL,
  `stepId` varchar(10) NOT NULL,
  `modelguid` varchar(50) NOT NULL,
  `stepconfig` text NOT NULL,
  PRIMARY KEY (`rowguid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;

GO

ALTER TABLE dxp_model_flow_info ADD COLUMN flowtype VARCHAR(50) DEFAULT '1';

GO

-- DELIMITER ; --
--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
ALTER TABLE dxp_model_flow_info ADD COLUMN isgeneral varchar(50);

GO

ALTER TABLE dxp_model_flow_info ADD COLUMN isuse varchar(50);

GO

-- DELIMITER ; --
--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
ALTER TABLE dxp_flow_info ADD COLUMN hivesql text;

GO

ALTER TABLE dxp_flow_info ADD COLUMN hivedsid INT;

GO

-- DELIMITER ; --
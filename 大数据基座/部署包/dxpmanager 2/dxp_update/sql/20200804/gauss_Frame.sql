--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

CREATE TABLE dxp_subassembly_right (
  rowguid varchar(50) NOT NULL PRIMARY KEY,
  ouguid varchar(50) DEFAULT NULL,
  pluginguid varchar(50) DEFAULT NULL,
  plugintype varchar(50) DEFAULT NULL
) 

GO

INSERT INTO frame_module VALUES('31e35a13-22ca-494f-99e6-2d367c8bef31', '999901090004', '组件权限管理', '', 'dxp/development/dxpsubassemblyrightlist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_moduleright VALUES ('31e35a13-22ca-494f-99e6-2d367c8bef31', 'All', 'Role', NULL, 'public')

GO
-- DELIMITER ; --
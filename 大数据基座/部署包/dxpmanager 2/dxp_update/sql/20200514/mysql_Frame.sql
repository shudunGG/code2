--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

UPDATE frame_module set MODULEURL='' where moduleguid='ea1ead5b-94c8-4403-bff8-49e11ddf8840';

GO

INSERT INTO frame_module VALUES ('d64afdd9-f65c-40d9-8c3b-8fd8f494ec21', '000300010003', 'hive数仓开发', '', 'dxp/development/hiveflow/hivedevelopflowinfolist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);

GO

INSERT INTO frame_module VALUES ('d8ec4d11-f33a-4021-b942-5e1cd680adbf', '000300010001', 'ETL开发', '', 'dxp/development/flowinfo/devflowinfolist?flowType=02', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);

GO

INSERT INTO frame_module VALUES ('fc5f2fc6-4e31-4718-b19e-d3b7c5767a27', '000300010004', 'DAG编排', '', 'dxp/development/flowinfo/devdagflowinfolist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);

GO

INSERT INTO frame_moduleright (MODULEGUID, ALLOWTO, ALLOWTYPE, isfromsoa, righttype) VALUES ('fc5f2fc6-4e31-4718-b19e-d3b7c5767a27', 'All', 'Role', NULL, 'public');

GO

INSERT INTO frame_moduleright (MODULEGUID, ALLOWTO, ALLOWTYPE, isfromsoa, righttype) VALUES ('d64afdd9-f65c-40d9-8c3b-8fd8f494ec21', 'All', 'Role', NULL, 'public');

GO

INSERT INTO frame_moduleright (MODULEGUID, ALLOWTO, ALLOWTYPE, isfromsoa, righttype) VALUES ('d8ec4d11-f33a-4021-b942-5e1cd680adbf', 'All', 'Role', NULL, 'public');

GO


-- DELIMITER ; --
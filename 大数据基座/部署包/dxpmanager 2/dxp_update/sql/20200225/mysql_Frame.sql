--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

--添加cdc集成交换策略
INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('311d1346-ebb8-4830-b786-40ee26d370e4', 'mysql', 'oracle', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到oracleCDC', '', '2020-02-07 10:06:39');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('3ec58d45-f927-4548-914d-f45d067159d9', 'mysql', 'GaussDB200', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到GaussDB200CDC', '', '2020-02-07 10:08:54');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES  ('42ba6e92-47c5-4ffc-a9ef-6c75988f0242', 'mysql', 'mysql', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到mysqlCDC', '', '2020-02-07 10:05:46');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES  ('8681494c-1db6-4504-89b7-8b852ba31f87', 'mysql', 'sqlserver', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到sqlserverCDC', '', '2020-02-07 10:07:00');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES  ('b5497071-8d94-47de-bdb3-8508cb6ce6ca', 'mysql', 'zenith', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到GaussDB100CDC', '', '2020-02-07 10:08:30');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES  ('da02a0b6-e5b8-49c2-a893-f92675056bed', 'mysql', 'dm', 'CDC', '007', 'com.epoint.dxp.action.template.api.impl.CdcApiImpl', 'mysql到达梦CDC', '', '2020-02-07 10:08:00');

GO


-- DELIMITER ; --
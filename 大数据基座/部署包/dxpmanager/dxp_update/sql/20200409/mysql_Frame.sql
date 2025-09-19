--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

--添加消费者组关联表
INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('36d4390b-a208-49c1-85c4-7f674f426529', 'GaussDB200', 'mysql', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.StandardTransApiImpl', 'GaussDB200到mysql触发器', '', '2020-03-18 22:03:33');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fe8019e-69c2-11ea-a305-005056900951', 'GaussDB200', 'GaussDB200', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.MppStandardTransApiImpl', 'GaussDB200到GaussDB200触发器', '', '2020-03-19 17:17:21');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fe879b8-69c2-11ea-a305-005056900951', 'GaussDB200', 'sqlserver', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.StandardTransApiImpl', 'GaussDB200到sqlserver触发器', '', '2020-03-19 17:17:21');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fe8da54-69c2-11ea-a305-005056900951', 'GaussDB200', 'oracle', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.StandardTransApiImpl', 'GaussDB200到oracle触发器', '', '2020-03-19 17:17:21');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fe9cd6c-69c2-11ea-a305-005056900951', 'GaussDB200', 'GaussDB100', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.StandardTransApiImpl', 'GaussDB200到GaussDB100触发器', '', '2020-03-19 17:17:21');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fea8c29-69c2-11ea-a305-005056900951', 'GaussDB200', 'dm', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.StandardTransApiImpl', 'GaussDB200到达梦触发器', '', '2020-03-19 17:17:21');

GO

INSERT INTO dxp_exchange_type(rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6fef0d90-69c2-11ea-a305-005056900951', 'GaussDB200', 'postgresql', '触发器增量', '003', 'com.epoint.dxp.action.template.api.impl.MppStandardTransApiImpl', 'GaussDB200到postgresql触发器', '', '2020-03-19 17:17:21');

-- DELIMITER ; --
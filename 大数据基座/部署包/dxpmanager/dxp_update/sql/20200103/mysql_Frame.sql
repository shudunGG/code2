--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

alter table dxp_flow_info add column ouguid varchar(50);

GO

alter table dxp_flow_info add column baseouguid varchar(50);

GO

alter table dxp_flow_group add column ouguid varchar(50);

GO

alter table dxp_flow_group add column baseouguid varchar(50);

GO

--添加文件集成交换策略
INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('6791e2ae-ae45-47d3-9cdd-92208e7cd2e7', 'SFTP', 'postgresql', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到postgresql', '', '2020-01-14 13:41:44');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('1a9d74f1-1896-4818-80f1-068f4e899021', 'SFTP', 'GaussDB200', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到guassDB200', '', '2020-01-14 13:41:08');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('cf7f188d-1933-48c8-b7d7-cd61c31ecf47', 'SFTP', 'dm', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到达梦', '', '2020-01-14 13:40:44');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('e063e491-87ca-48d7-a1dc-0d825325b70e', 'SFTP', 'zenith', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到guassDB100', '', '2020-01-14 13:40:23');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('7279b51d-e88e-40b0-9f14-2b65094de298', 'SFTP', 'sqlserver', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到sqlserver', '', '2020-01-14 13:39:54');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('91859bfe-3c16-4511-9781-7411643e124c', 'SFTP', 'oracle', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到oracle', '', '2020-01-14 13:39:10');

GO

INSERT INTO dxp_exchange_type (rowguid, fromdstype, targetdstype, templatename, templatecode, templateclass, name, templatedesc, insertdate) VALUES ('7824a1be-d187-43a0-a342-b4823b560ef9', 'SFTP', 'mysql', '全量', '001', 'com.epoint.dxp.action.template.api.impl.SFTPToTableApiImpl', 'SFTP到mysql', '', '2020-01-07 20:43:01');

GO



-- DELIMITER ; --
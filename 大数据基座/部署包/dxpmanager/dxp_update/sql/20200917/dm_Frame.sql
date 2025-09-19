--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
CREATE TABLE dxp_model_jar (
  rowguid varchar(50) NOT NULL PRIMARY KEY,
  jarname varchar(200) DEFAULT NULL,
  importdate date DEFAULT NULL,
  operatedate date DEFAULT NULL,
  hdfsdsid integer DEFAULT NULL,
  ordernum integer DEFAULT NULL,
  description varchar(500) DEFAULT NULL
)

GO

CREATE TABLE dxp_model_udf (
  rowguid varchar(50) NOT NULL PRIMARY KEY,
  udfname varchar(200) DEFAULT NULL,
  jarguid varchar(50) DEFAULT NULL,
  jarclasspath varchar(800) DEFAULT NULL,
  hivedsid bigint DEFAULT NULL,
  functionname varchar(500) DEFAULT NULL,
  functionparams varchar(800) DEFAULT NULL,
  enable integer DEFAULT NULL,
  ordernum integer DEFAULT NULL,
  type integer DEFAULT NULL,
  description varchar(500) DEFAULT NULL
)

GO

INSERT INTO frame_module (MODULEGUID,MODULECODE,MODULENAME,MOUDLEMENUNAME,MODULEURL,ORDERNUMBER,ISDISABLE,ISBLANK,BIGICONADDRESS,SMALLICONADDRESS,MODULETYPE,ISADDOU,ROW_ID,isfromsoa,IsUse,IsReserved) VALUES 
('87423345-fe53-496e-b5f6-a59eb27f0e12','999901090005','UDF函数JAR包管理','','dxp/datamodel/modelassemblymanager/modeljarmanager',70,0,0,';',NULL,'public',0,NULL,NULL,NULL,0)

GO

INSERT INTO frame_module (MODULEGUID,MODULECODE,MODULENAME,MOUDLEMENUNAME,MODULEURL,ORDERNUMBER,ISDISABLE,ISBLANK,BIGICONADDRESS,SMALLICONADDRESS,MODULETYPE,ISADDOU,ROW_ID,isfromsoa,IsUse,IsReserved) VALUES 
('de56a5e4-48dd-409a-9364-93ed8aeb2c17','999901090004','UDF函数管理','','dxp/datamodel/modelassemblymanager/modeludfmanager',60,0,0,';',NULL,'public',0,NULL,NULL,NULL,0)

GO

INSERT INTO frame_moduleright (MODULEGUID,ALLOWTO,ALLOWTYPE,isfromsoa,righttype) VALUES ('87423345-fe53-496e-b5f6-a59eb27f0e12','1eb07a29-51c8-4944-8dc7-594a8fddf681','Role',NULL,'public')

GO

INSERT INTO frame_moduleright (MODULEGUID,ALLOWTO,ALLOWTYPE,isfromsoa,righttype) VALUES ('de56a5e4-48dd-409a-9364-93ed8aeb2c17','1eb07a29-51c8-4944-8dc7-594a8fddf681','Role',NULL,'public')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('14d102a2-8d4f-4dd8-8d20-611a1049e29d','oracle','dm','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到达梦CDC','','2020-09-17 20:44:18.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('1d723406-78c8-4a35-80b4-0d3f19fa541b','oracle','mysql','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到mysqlCDC','','2020-09-17 20:45:43.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('2785207d-12f7-4cc4-98af-3bc5ce3340fc','oracle','sqlserver','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到sqlserverCDC','','2020-09-17 20:45:24.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('31dd614b-936f-4879-9849-1f53737aa82b','oracle','GaussDB200','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到GaussDB100CDC','','2020-09-17 20:45:02.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('70d52e99-9755-4a94-9523-1678abc49571','sqlserver','zenith','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqls到GaussDB100CDC','','2020-09-17 20:42:48.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('70f30321-91e6-4b03-8e7a-47b3a98ec6d0','sqlserver','GaussDB200','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqlserver到GaussDB200CDC','','2020-09-17 20:42:22.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('7a22e22b-f9cc-43fb-a07b-17ee73c2c89d','sqlserver','sqlserver','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqlserver到sqlserverCDC','','2020-09-17 20:42:01.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('8c3027d7-9c83-40a2-9363-38f4a6fb6d0b','sqlserver','dm','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqlserver到达梦CDC','','2020-09-17 20:43:11.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('b654577e-351e-4dfc-ba9b-1b58c65d20c6','oracle','GaussDB200','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到GaussDB200CDC','','2020-09-17 20:44:42.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('d91b75a4-b00e-4107-a39c-6c86d0c0c97c','sqlserver','mysql','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqlserver到mysqlCDC','','2020-09-17 20:41:28.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('e1aefcce-09b8-4996-8072-14c4d37b96c6','sqlserver','oracle','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','sqlserver到oracleCDC','','2020-09-17 20:43:31.0')

GO

INSERT INTO dxp_exchange_type (rowguid,fromdstype,targetdstype,templatename,templatecode,templateclass,name,templatedesc,insertdate) VALUES ('f61dc770-1ab6-4c16-af64-25343714450e','oracle','oracle','CDC','007','com.epoint.dxp.action.template.api.impl.CdcApiImpl','oracle到oracleCDC','','2020-09-17 20:43:56.0')

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_apiinfo' and column_name='product_id') <1 then
alter table eia_apiinfo add COLUMN product_id VARCHAR(255) DEFAULT NULL;
end if;
if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_apiinfo' and column_name='plan_id') <1 then
alter table eia_apiinfo add COLUMN plan_id VARCHAR(255) DEFAULT NULL;
end if;
if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_apiinfo' and column_name='backend_id') <1 then
alter table eia_apiinfo add COLUMN backend_id VARCHAR(255) DEFAULT NULL;
end if;
if (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) 	AND table_name = 'eia_apiinfo' and column_name='operation_id') <1 then
alter table eia_apiinfo add COLUMN operation_id VARCHAR(255) DEFAULT NULL;
end if;
if (select count(*) from frame_config_category WHERE CATEGORYNAME='API相关')<1 then
INSERT INTO frame_config_category (CATEGORYGUID, CATEGORYNAME, CATEGORYDES, ORDERNUMBER) VALUES ('103afb14-0f93-43f9-bc12-c7c60cf06618', 'API相关', '', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='ApiServiceType')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('f8ee420a-3daf-405c-8179-4be9a94b7f6e', 'APIG_USERNAME', '', 'IAM_用户名,示例：data02', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_PASSWORD')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('edd601f6-1ad4-4a3a-b30c-ab0bbad5dbda', 'APIG_PASSWORD', '', '用户密码，示例：Huawei@123', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_ADDRESS')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('42ac39a1-e484-4a52-b024-cf84ef00cc14', 'APIG_ADDRESS', '', 'apig_rest端，地址示例：https://22.62.73.144:8643', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_TOKENURL')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('787ecf8a-9a21-4020-a585-ccea3d897740', 'APIG_TOKENURL', '', 'IAM-endpoint，示例：https://auth.scsgmc.ggcc.com.cn/v3/auth', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_MICROGATEWAYSNAME')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('7dd5fa65-4c75-400c-9b3e-f8fe1d33e2f4', 'APIG_MICROGATEWAYSNAME', '', '微网关名称，示例：microgateway_96.0.28.129', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_DOMAINNAME')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('0b080231-4e05-4c5d-ad52-4d9789df51f5', 'APIG_DOMAINNAME', '', '组户名，示例：FusionStageResVDC IAM-endpoint，示例：https://auth.scsgmc.ggcc.com.cn/v3/auth', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='APIG_PROJECTID')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('94b50ad5-e1dd-4ee9-b4c2-a5adab5b2b64', 'APIG_PROJECTID', '', '项目id，示例：0d1ce8190d44489v89e0c0833dd86', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
if (select count(*) from frame_config WHERE CONFIGNAME='ApiServiceType')<1 then
INSERT INTO frame_config (SYSGUID, CONFIGNAME, CONFIGVALUE, DESCRIPTION, ROW_ID, CLIENTTAG, CATEGORYGUID, ORDERNUMBER, isrestjsboot, manageindependent) VALUES ('dfb27643-2a1e-4ee3-803a-d4f49d02e5a3', 'ApiServiceType', 'KONG', 'API注册平台配置，KONG：发布到统一网关上，APIG：发布到APIG平台，DAYU：发布到dayu-DLM平台，不配置默认发布到统一网关上', '0', NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', '0', '0', '0');
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --
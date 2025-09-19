--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
INSERT INTO frame_module (MODULEGUID,MODULECODE,MODULENAME,MOUDLEMENUNAME,MODULEURL,ORDERNUMBER,ISDISABLE,ISBLANK,BIGICONADDRESS,SMALLICONADDRESS,MODULETYPE,ISADDOU,ROW_ID,isfromsoa,IsUse,IsReserved) VALUES 
('edc42440-e6ea-4876-9cd6-f12a57bc796b','7799','数据监听','','',81,0,0,';',NULL,'public',0,NULL,NULL,NULL,0)
;

GO

INSERT INTO frame_module (MODULEGUID,MODULECODE,MODULENAME,MOUDLEMENUNAME,MODULEURL,ORDERNUMBER,ISDISABLE,ISBLANK,BIGICONADDRESS,SMALLICONADDRESS,MODULETYPE,ISADDOU,ROW_ID,isfromsoa,IsUse,IsReserved) VALUES 
('03069f55-b7dd-465c-9199-4257ce7ac666','77990002','cdc消费任务','','dxp/cdc/cdcconsumerlist',0,0,0,';',NULL,'public',0,NULL,NULL,NULL,0)
;

GO

INSERT INTO frame_module (MODULEGUID,MODULECODE,MODULENAME,MOUDLEMENUNAME,MODULEURL,ORDERNUMBER,ISDISABLE,ISBLANK,BIGICONADDRESS,SMALLICONADDRESS,MODULETYPE,ISADDOU,ROW_ID,isfromsoa,IsUse,IsReserved) VALUES 
('98d9d928-4b33-40f5-b810-13df8aadb74c','77990001','cdc监听任务','','dxp/cdc/cdcproducerlist',0,0,0,';',NULL,'public',0,NULL,NULL,NULL,0)
;

GO

INSERT INTO frame_moduleright (MODULEGUID,ALLOWTO,ALLOWTYPE,isfromsoa,righttype) VALUES 
('edc42440-e6ea-4876-9cd6-f12a57bc796b','All','Role',NULL,'public')
;

GO

INSERT INTO frame_moduleright (MODULEGUID,ALLOWTO,ALLOWTYPE,isfromsoa,righttype) VALUES 
('03069f55-b7dd-465c-9199-4257ce7ac666','All','Role',NULL,'public')
;

GO

INSERT INTO frame_moduleright (MODULEGUID,ALLOWTO,ALLOWTYPE,isfromsoa,righttype) VALUES 
('98d9d928-4b33-40f5-b810-13df8aadb74c','All','Role',NULL,'public')
;

GO

alter table dxp_flow_info add column cdcdsip nvarchar(50);

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES 
('06ba3968-0737-41ad-a516-c20b6984c0c7','CDC数据同步','EpointSynchronizeAfterMergeForCdc','com.epoint.dxp.development.trans.steps.EpointSynchronizeAfterMergeForCdcStep','images/add-icon/synchrodata.png','images/icon/synchrodata.png','./transassembly/epointsynchronizeaftermergeforcdc.html','CDC数据同步',0,'2c700a9c-18c1-4674-a67f-b884d8ce499f',80,NULL,NULL,1)
;

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES 
('cbe64eeb-631b-4afd-88bd-af69b6973091','CDC数据同步（ES）','EpointWriteToESForCdc','com.epoint.dxp.development.trans.steps.EpointWriteToESForCdcStep','images/add-icon/synchrodata.png','images/icon/synchrodata.png','./transassembly/epointwritetoesforcdc.html','CDC数据同步（ES）',0,'2c700a9c-18c1-4674-a67f-b884d8ce499f',79,NULL,NULL,1)
;

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES 
('d41b0423-ae21-4639-a0ca-d0633b0fc67a','ES输出','EpointWriteToES','com.epoint.dxp.development.trans.steps.EpointWriteToESStep','images/add-icon/table-put.png','images/icon/table-put.png','./transassembly/epointwritetoes.html','ES输出',0,'2c700a9c-18c1-4674-a67f-b884d8ce499f',80,NULL,NULL,1)
;

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES 
('2e4e8973-e69e-4d98-893c-4633e5c05788','kafka位点','KafkaOffset','com.epoint.dxp.development.trans.steps.KafkaOffsetStep','images/add-icon/systemdata.png','images/icon/systemdata.png','./transassembly/kafkaoffset.html','kafka位点',0,'2c700a9c-18c1-4674-a67f-b884d8ce499f',80,NULL,NULL,1)
;

GO

-- DELIMITER ; --
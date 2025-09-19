--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,`maxLinks`,enable,maxinputlinks) VALUES ('81763f56-3a9f-40f8-96ae-030c69f6f04e','Web服务查询','WebServiceLookup','com.epoint.dxp.development.trans.steps.WebServiceStep','images/add-icon/webservice.png','images/icon/webservice.png','./transassembly/webservice.html','Web服务查询',0,'60e1fc55-2a6a-437f-b977-f1d5f6d3ec19',100,NULL,1,NULL);

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,`maxLinks`,enable,maxinputlinks) VALUES ('35c4a6d3-1c7f-4ee3-9dd5-b481b9e4416a','比特信安水印','BtxaWatermark','com.epoint.dxp.development.trans.steps.BtxaWatermarkStep','images/add-icon/btxawatermark.png','images/icon/btxawatermark.png','./transassembly/btxawatermark.html','比特信安水印',0,'480ee04d-0f7b-4170-80d6-4845a651837a',100,NULL,1,NULL);

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,`maxLinks`,enable,maxinputlinks) VALUES ('7934af6b-7a3b-47b5-a0a6-6a83cd26e2d0','计算表中的记录数','EVAL_TABLE_CONTENT','com.epoint.dxp.development.flow.steps.SimpleEvalEntryStep','images/add-icon/evaltablecontent.png','images/icon/evaltablecontent.png','./jobassembly/evaltablecontent.html','计算表中的记录数',0,'30a1d2b6-062e-4efe-9142-f6e39a64c293',100,NULL,1,NULL);

GO

-- DELIMITER ; --
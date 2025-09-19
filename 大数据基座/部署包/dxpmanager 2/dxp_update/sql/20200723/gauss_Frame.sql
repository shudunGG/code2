--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES ('8829b69a-af70-497c-9e56-893b09661a11','cdc位点','EpointCdcSite','com.epoint.dxp.development.trans.steps.EpointCdcSiteStep','images/add-icon/epointcdcsite.png','images/icon/epointcdcsite.png','./transassembly/epointcdcsite.html','cdc位点',0,'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39',0,1,NULL,1)

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES ('89fd14ba-d97c-459e-9a7e-9222d6ca7489','数据库日志输出','EpointCdcWrite','com.epoint.dxp.development.trans.steps.EpointCdcWriteStep','images/add-icon/table-put.png','images/icon/table-put.png','./transassembly/epointcdcwrite.html','数据库日志输出',0,'2c700a9c-18c1-4674-a67f-b884d8ce499f',0,1,NULL,1)

GO

INSERT INTO dxp_subassembly (rowguid,pluginname,steptype,classpath,iconsmall,icon,url,introduce,banwrong,groupguid,ordernum,maxLinks,maxInputLinks,enable) VALUES ('9ee5e4d4-5be6-4f25-8634-dbfc093492b3','数据库日志采集','EpointCdc','com.epoint.dxp.development.trans.steps.EpointCdcStep','images/icon/input-table.png','images/icon/input-table.png','./transassembly/epointcdc.html','数据库日志采集',0,'c70c5849-ae73-4a4b-b8b2-23a7a00e7551',20,1,NULL,1)

GO

-- DELIMITER ; --
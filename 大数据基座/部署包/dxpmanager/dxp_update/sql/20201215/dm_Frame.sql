-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

ALTER TABLE dxp_flow_info ADD COLUMN prestodsid INTEGER

GO

CREATE TABLE dxp_model_flow_info (
 rowguid VARCHAR(50) NOT NULL,
  flowconfig TEXT,
  flowattachguid VARCHAR(50) DEFAULT NULL,
  nodeguid VARCHAR(50) DEFAULT NULL,
  generatestatus INTEGER DEFAULT NULL,
  publishstatus INTEGER DEFAULT NULL,
  sourceouguid VARCHAR(50) DEFAULT NULL,
  targetouguid VARCHAR(50) DEFAULT NULL,
  flowname VARCHAR(255) DEFAULT NULL,
  generatedate DATETIME DEFAULT NULL,
  operatedate DATETIME DEFAULT NULL,
  flowmd5 VARCHAR(255) DEFAULT NULL,
  xms INTEGER DEFAULT '0',
  xmx INTEGER DEFAULT '0',
  livyPath VARCHAR(100) DEFAULT NULL,
  hdptype VARCHAR(100) DEFAULT NULL,
  groupguid VARCHAR(50) DEFAULT NULL,
  fromdsid INTEGER DEFAULT NULL,
  targetdsid INTEGER DEFAULT NULL,
  subscribetype VARCHAR(10) DEFAULT NULL,
  fromtable VARCHAR(200) DEFAULT NULL,
  targettable VARCHAR(200) DEFAULT NULL,
  ouguid VARCHAR(50) DEFAULT NULL,
  baseouguid VARCHAR(50) DEFAULT NULL,
  hivedsid INTEGER DEFAULT NULL,
  prestodsid INTEGER DEFAULT NULL,
)
-- end;
-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

CREATE TABLE dxp_presto_hive_relate (
  rowguid varchar(50) NOT NULL,
  prestodsid INTEGER DEFAULT NULL,
  hivedsid INTEGER DEFAULT NULL,
  hdfsdsid INTEGER DEFAULT NULL
)

-- end;
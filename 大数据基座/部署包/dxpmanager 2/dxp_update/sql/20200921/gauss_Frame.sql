-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
CREATE TABLE dxp_model_tableimportinfo (
  rowguid varchar(50) NOT NULL PRIMARY KEY ,
  flowconfig text,
  status int(11)  NULL,
  importdate datetime  NULL,
  operatedate datetime  NULL,
  fromdsid int(11)  NULL,
  targetdsid int(11)  NULL,
  fromtable varchar(200)  NULL,
  targettable varchar(200)  NULL,
  tablecount bigint(20)  NULL,
  userguid varchar(100)  NULL,
  ouguid varchar(50)  NULL,
  baseouguid varchar(50)  NULL,
  type int(1)  NULL,
   FS varchar(50)  NULL,
  nodeguid varchar(50)  NULL
);

-- end;
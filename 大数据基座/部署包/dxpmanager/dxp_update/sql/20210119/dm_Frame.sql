--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
CREATE TABLE dxp_model_table_type (
  rowguid varchar(50) NOT NULL PRIMARY KEY,
  typename varchar(200) NOT NULL,
  ordernum int(11) NULL
);

GO

CREATE TABLE dxp_model_onlineusernum (
  Rowguid varchar(50) NOT NULL PRIMARY KEY,
  monitorTime datetime(6) NULL,
  userNum int(11) NULL
);

GO

-- DELIMITER ; --
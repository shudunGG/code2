-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

CREATE TABLE dxp_kafka_consume_group_relate (
  rowguid varchar(50) NOT NULL,
  topicguid varchar(50) DEFAULT NULL,
  groupname varchar(100) DEFAULT NULL,
  flowguid varchar(500) DEFAULT NULL
)

-- end;
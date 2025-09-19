-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/04
 
-- 添加表frame_operateratelimit_config   --吴琦
create table if not exists frame_operateratelimit_config (
  OperateUserName varchar(50) DEFAULT NULL,
  OperateDate datetime DEFAULT NULL,
  RowGuid varchar(50) NOT NULL,
  OperateUserGuid varchar(50) DEFAULT NULL,
  PolicyRemark varchar(200) DEFAULT NULL,
  TargetUserGuid varchar(50) DEFAULT NULL,
  TargetUserName varchar(50) DEFAULT NULL,
  PageUrl varchar(500) NOT NULL,
  TimeInterval int(11) DEFAULT NULL,
  MaxCount int(11) DEFAULT NULL,
  VerificationMode varchar(50) DEFAULT NULL,
  PolicyValidPeriod int(11) DEFAULT NULL,
  PolicyEnabled int(11) DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- DELIMITER ; --
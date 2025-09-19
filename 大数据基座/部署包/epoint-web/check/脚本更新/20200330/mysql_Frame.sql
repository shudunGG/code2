-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/30
 
-- 添加表frame_sms_verification   --吴琦
create table if not exists frame_sms_verification (
  RowGuid varchar(50) NOT NULL,
  OperateUserGuid varchar(50) DEFAULT NULL,
  smscode varchar(50) DEFAULT NULL,
  smsno varchar(50) DEFAULT NULL,
  createtime datetime DEFAULT NULL,
  mobilenumber varchar(50) DEFAULT NULL,
  isuesed int(11) DEFAULT NULL,
  verifytime datetime DEFAULT NULL,
  verifyIP varchar(50) DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- 添加表frame_restricted_info   --吴琦
create table if not exists frame_restricted_info (
  RowGuid varchar(50) NOT NULL,
  RestrictedType varchar(50) DEFAULT NULL,
  RestrictedCreateTime datetime DEFAULT NULL,
  IsManualTerminate int(11) DEFAULT NULL,
  AutoTerminateTime datetime DEFAULT NULL,
  ManualTerminateTime datetime DEFAULT NULL,
  UserGuid varchar(50) DEFAULT NULL,
  RestrictedObj varchar(50) DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- DELIMITER ; --
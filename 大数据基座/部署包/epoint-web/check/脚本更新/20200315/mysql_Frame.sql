-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/15
 
-- 添加表frame_attachrightconfig   --吴琦
create table if not exists frame_attachrightconfig (
  OperateDate datetime DEFAULT NULL,
  RowGuid varchar(50) NOT NULL,
  verifytype varchar(50) DEFAULT NULL,
  verifyto varchar(2000) DEFAULT NULL,
  isenabled int(11) DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- 添加表frame_attachrightinfo   --吴琦
create table if not exists frame_attachrightinfo (
  RowGuid varchar(50) NOT NULL,
  attachrightguid varchar(50) DEFAULT NULL,
  allowtype varchar(100) DEFAULT NULL,
  allowto varchar(100) DEFAULT NULL,
  isenabled int(11) DEFAULT NULL,
  righttype varchar(50) DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- DELIMITER ; --
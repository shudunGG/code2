-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/02/07 【时间】
-- 添加表frame_ui_deskmodule、frame_ui_desk_personalmodule --【陈星怡】

-- frame_ui_deskmodule
CREATE TABLE IF NOT EXISTS frame_ui_deskmodule (
  rowguid varchar(50) NOT NULL,
  sourceguid varchar(50) NOT NULL,
  belongdeskguid varchar(50) NOT NULL,
  opentype varchar(50) DEFAULT NULL,
  ordernumber int(11) DEFAULT NULL,
  costomparam varchar(2000) DEFAULT NULL,
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- frame_ui_desk_personalmodule
CREATE TABLE IF NOT EXISTS frame_ui_desk_personalmodule (
  rowguid varchar(50) NOT NULL,
  deskmoduleguid varchar(50) NOT NULL,
  parentguid varchar(50) DEFAULT NULL,
  belongdeskguid varchar(50) NOT NULL,
  ordernumber int(11) DEFAULT NULL,
  userguid varchar(50) NOT NULL,
  isinstalled int(11) DEFAULT NULL,
  parentname varchar(50) DEFAULT NULL,
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- DELIMITER ; --
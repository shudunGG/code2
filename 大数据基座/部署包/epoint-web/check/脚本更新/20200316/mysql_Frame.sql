-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/16
CREATE TABLE if not exists app_sync_subscribe (
  rowguid             varchar(50) NOT NULL,
  clienttag           varchar(50) DEFAULT NULL,
  clientname          varchar(100) DEFAULT NULL,
  subscribepage       varchar(200) DEFAULT NULL,
  createdate          datetime DEFAULT NULL,
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

CREATE TABLE if not exists frame_soanotify_log(
  logguid              varchar(50) NOT NULL,
  status               int(11) DEFAULT NULL,
  eventname            varchar(50) DEFAULT NULL,
  entityname           varchar(100) DEFAULT NULL,
  datalist             mediumtext,
  clienttype           varchar(50) DEFAULT NULL,
  pushguid             varchar(50) DEFAULT NULL,
  remark               varchar(2000) DEFAULT NULL,
  appkey               varchar(50) DEFAULT NULL,
  notifylistener       varchar(100) DEFAULT NULL,
  pushdate datetime    DEFAULT NULL,
  pushurl varchar(200) DEFAULT NULL,
  PRIMARY KEY (logguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- 2020/03/16
-- 新建frame_privacy隐私表 --孟佳佳
CREATE TABLE if not exists frame_privacy (
  rowguid              	varchar(50) NOT NULL COMMENT '主键',
  privacyStatement     	text DEFAULT NULL COMMENT '隐私内容，富文本',
  privacyVersion       	varchar(50) DEFAULT NULL COMMENT '隐私声明版本号',
  privacyStatus		   	int(1) DEFAULT 0 COMMENT '状态(1-发布，0-草稿)，只能有一个发布',
  publishTime			datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- 2020/03/16
-- 新建frame_privacy_agree隐私同意表 --孟佳佳
CREATE TABLE if not exists frame_privacy_agree(
  rowguid              	varchar(50) NOT NULL COMMENT '主键',
  privacyGuid          	varchar(50) DEFAULT NULL COMMENT '隐私主键',
  agreeUserguid         varchar(50) DEFAULT NULL COMMENT '记入同意人guid',
  agreeTime           	datetime DEFAULT NULL COMMENT '同意时间',
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/07/02 
-- 新增开放平台配置表, token表--【施佳炜】
CREATE TABLE if not exists frame_open_platform_config(
  configname varchar(100) NOT NULL,
  configvalue varchar(500) DEFAULT NULL,
  description varchar(2000) DEFAULT NULL,
  relationguid varchar(50) DEFAULT NULL,
  platform varchar(50) DEFAULT NULL,
  rowguid varchar(50) NOT NULL,
  PRIMARY KEY (rowguid) 
);
GO

CREATE TABLE if not exists sso_token_info(
  rowguid varchar(50) NOT NULL,
  keystr varchar(50) DEFAULT NULL,
  clientid varchar(50) DEFAULT NULL,
  principal varchar(100) DEFAULT NULL,
  userguid varchar(50) DEFAULT NULL,
  refreshtoken varchar(50) DEFAULT NULL,
  sessionid varchar(50) DEFAULT NULL,
  exin int(11) DEFAULT '0',
  createtime datetime DEFAULT NULL,
  scope varchar(1000) DEFAULT NULL,
  apis text DEFAULT NULL,
  type varchar(50) DEFAULT NULL,
  PRIMARY KEY (rowguid) 
);
GO

-- DELIMITER ; --
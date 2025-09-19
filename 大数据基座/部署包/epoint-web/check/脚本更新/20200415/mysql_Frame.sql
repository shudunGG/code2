-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/24 【时间】
-- 添加epoint_job_manager_config-- 吴俊涛

CREATE TABLE if NOT EXISTS epoint_job_manager_config (
  rowguid varchar(50) NOT NULL,
  configname varchar(100) NOT NULL COMMENT '配置名',
  configvalue varchar(512) DEFAULT NULL COMMENT '配置值',
  PRIMARY KEY (rowguid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- DELIMITER; --
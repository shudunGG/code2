-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/07/24 【时间】
-- 企业微信组织架构同步，新增1个部门id对照表（frame_ou_weixin）--何晓瑜

CREATE TABLE if not exists frame_ou_weixin(
  ouguid varchar(50) NOT NULL,
  id int(8) not null primary key
);
GO

-- DELIMITER ; --
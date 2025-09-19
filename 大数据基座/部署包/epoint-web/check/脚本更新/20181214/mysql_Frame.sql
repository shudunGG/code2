-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/10/30
-- 多账号关系表  --徐剑

-- 添加多账号关系表
create table if not exists frame_accountrelation
(
  rowguid             nvarchar(50) not null primary key,
  userguid            nvarchar(50),
  ordernumber         int,
  relativeuserguid    nvarchar(50)
);
GO

-- 添加多账号关系表snapshot表
create table if not exists frame_accountrelation_snapshot
(
  rowguid             nvarchar(50) not null primary key,
  userguid            nvarchar(50),
  ordernumber         int,
  relativeuserguid    nvarchar(50),
  accountrelationguid nvarchar(50),
  appkey              nvarchar(50),
  clientip            nvarchar(50)
);
GO

-- DELIMITER ; --
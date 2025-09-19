-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/10/15

-- 添加涉密等级表 --季立霞
create table if not exists frame_secretlevel
(
  rowguid              nvarchar(50) not null primary key,
  levelname            nvarchar(50),
  secretlevel		      	int(11)
);
GO

-- 添加涉密等级快照表 --季立霞
create table if not exists frame_secretlevel_snapshot
(
  rowguid              nvarchar(50) not null,
  levelname            nvarchar(50),
  secretlevel		       int(11),
  appkey               nvarchar(100),
  clientip             nvarchar(50),
  levelguid      nvarchar(50) not null primary key
);
GO


-- 添加防篡改管理表
create table if not exists frame_anti_tamper
(
  rowguid        nvarchar(50) not null primary key,
  tablename      nvarchar(50),
  anticolumns    nvarchar(2000),
  status         int(11),
  ordernumber    int(11)
);
GO


-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/7/14 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加表
create table if not exists epointsform_method
(
  methodGuid   nvarchar(100) not null primary key,
  versionGuid    nvarchar(100),
  tableGuid   nvarchar(100),
  tableId   int,
  dllPath   nvarchar(2000),
  typeName nvarchar(100),
  methodName  nvarchar(100),
  returnValueType  nvarchar(100),
  orderNum int,
  note   nvarchar(2000)
);
GO


-- 添加表
create table if not exists epointsform_event
(
  eventGuid   nvarchar(100) not null primary key,
  eventName    nvarchar(100),
  eventType int,
  eventMethodGuid nvarchar(100),
  versionGuid nvarchar(100),
  tableGuid   nvarchar(100),
  tableId   int,
  belongTo  int,
  orderNum int,
  note   nvarchar(1000)
);
GO

-- DELIMITER ; --
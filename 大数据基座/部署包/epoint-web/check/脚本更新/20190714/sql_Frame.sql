-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/7/13 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_method'))
create table epointsform_method
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
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_event'))
create table epointsform_event
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
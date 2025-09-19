-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/10/30
-- 多账号关系表  --徐剑

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('frame_accountrelation_snapshot'))
create table frame_accountrelation_snapshot
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

if not exists (select * from dbo.sysobjects where id = object_id('frame_accountrelation'))
create table frame_accountrelation
   (
    rowguid             nvarchar(50) not null primary key,
    userguid            nvarchar(50),
    ordernumber         int,
    relativeuserguid    nvarchar(50)  
    );
GO
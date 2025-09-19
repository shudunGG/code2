-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/10/15
-- 添加涉密等级表 --季立霞
if not exists (select * from dbo.sysobjects where id = object_id('frame_secretlevel'))
create table frame_secretlevel
   (
    rowguid      nvarchar(50) not null primary key,
    levelname     nvarchar(50),
    secretlevel	 int
    );
GO

-- 添加涉密等级快照表 --季立霞
if not exists (select * from dbo.sysobjects where id = object_id('frame_secretlevel_snapshot'))
create table frame_secretlevel_snapshot
   (
    rowguid      nvarchar(50) not null,
    levelname    nvarchar(50),
    secretlevel	 int,
    appkey       nvarchar(100),
    clientip     nvarchar(50),
    levelguid         nvarchar(50) not null primary key
    );
GO

-- 添加防篡改管理表 
if not exists (select * from dbo.sysobjects where id = object_id('frame_anti_tamper'))
create table frame_anti_tamper
   (
    rowguid       nvarchar(50) not null primary key,
    tablename     nvarchar(50),
    anticolumns   nvarchar(2000),
    status	      int,
    ordernumber   int
    );
GO



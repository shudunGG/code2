-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/03/29

-- 添加frame_searchcategory表
if not exists (select * from dbo.sysobjects where id = object_id('frame_searchcategory'))
create table frame_searchcategory
   (
               rowguid  nvarchar(50) not null primary key,
               categoryname  nvarchar(50),
               parentguid  nvarchar(50),
               createuserguid  nvarchar(50),
               createdate  datetime,
               ordernumber  int
    );
GO

-- 添加frame_dataquery表
if not exists (select * from dbo.sysobjects where id = object_id('frame_dataquery'))
create table frame_dataquery
   (
               rowguid   nvarchar(50) not null primary key,
               conditionname  nvarchar(50),
               querytype  nvarchar(10),
               combination  nvarchar(500),
               queryentity  text,
               querycategory  nvarchar(50), 
               createuserguid  nvarchar(50),
               createdate  datetime,
               ordernumber  int
    );
GO


-- 添加方案主表frame_schemeshow表
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemeshow'))
create table frame_schemeshow
   (
               rowguid   nvarchar(50) not null primary key,
               tableId   int,
               schemetype  nvarchar(50),
               schemename  nvarchar(10),
               ordernumber  int,
               createuserguid  nvarchar(50),
               createdate  datetime,
               iscommon  nvarchar(5)
    );
GO

-- 添加方案明细frame_schemeshow表
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemeshowinfo'))
create table frame_schemeshowinfo
   (
               rowguid   nvarchar(50) not null primary key,
               schemeguid  nvarchar(50),
               fieldguid   nvarchar(50),
               ordernumber  int,
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO


-- 添加方案权限frame_schemeshowright表
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemeshowright'))
create table frame_schemeshowright
   (
               rowguid   nvarchar(50) not null primary key,
               schemeguid  nvarchar(50),
               allowtype   nvarchar(50),
               allowto   nvarchar(50),
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO


-- 添加frame_table_right表
if not exists (select * from dbo.sysobjects where id = object_id('frame_table_right'))
create table frame_table_right
   (
               rowguid   nvarchar(50) not null primary key,
               tableid  int,
               righttype  nvarchar(10),
               allowtype   nvarchar(50),
               allowto   nvarchar(50),
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO

-- 添加frame_tablestruct_right表
if not exists (select * from dbo.sysobjects where id = object_id('frame_tablestruct_right'))
create table frame_tablestruct_right
   (
               rowguid   nvarchar(50) not null primary key,
               tableid  int,
               fieldguid nvarchar(50),
               righttype  nvarchar(10),
               allowtype   nvarchar(50),
               allowto   nvarchar(50),
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO

-- 添加排序方案主表frame_schemeorder
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemeorder'))
create table frame_schemeorder
   (
               rowguid   nvarchar(50) not null primary key,
               schemename nvarchar(50),
               tableid  int,
               ordernumber int,
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO

-- 添加排序方案明细表frame_schemeorderinfo
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemeorderinfo'))
create table frame_schemeorderinfo
   (
               rowguid   nvarchar(50) not null primary key,
               schemeguid nvarchar(50),
               fieldguid nvarchar(50),
               ordertype nvarchar(50),
               ordernumber int,
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO


-- 添加表显示方案frame_schemetableshow
if not exists (select * from dbo.sysobjects where id = object_id('frame_schemetableshow'))
create table frame_schemetableshow
   (
               rowguid   nvarchar(50) not null primary key,
               parenttableid int,
               tableid int,
               ordernumber int,
               isvisible nvarchar(5),
               createuserguid  nvarchar(50),
               createdate  datetime
    );
GO


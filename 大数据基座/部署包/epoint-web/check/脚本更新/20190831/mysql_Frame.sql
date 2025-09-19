-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/04/01


-- 添加frame_searchcategory表
create table if not exists frame_searchcategory
(
     rowguid  varchar(50) not null primary key,
     categoryname  varchar(50),
     parentguid  varchar(50),
     createuserguid  varchar(50),
     createdate  datetime,
     ordernumber  int
);
GO


-- 添加frame_dataquery表
create table if not exists frame_dataquery
(
     rowguid   varchar(50) not null primary key,
     conditionname  varchar(50),
     querytype  varchar(10),
     combination  varchar(500),
     queryentity  text,
     querycategory  varchar(50), 
     createuserguid  varchar(50),
     createdate  datetime,
     ordernumber  int
);
GO

-- 添加方案主表frame_schemeshow表
create table if not exists frame_schemeshow
(
     rowguid   varchar(50) not null primary key,
     tableId   int,
     schemetype  varchar(50),
     schemename  varchar(50),
     ordernumber  int,
     createuserguid  varchar(50),
     createdate  datetime,
     iscommon  varchar(5)
);
GO


-- 添加方案明细frame_schemeshowinfo表
create table if not exists frame_schemeshowinfo
(
     rowguid   varchar(50) not null primary key,
     schemeguid   varchar(50),
     fieldguid   varchar(50),
     ordernumber  int,
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加方案权限frame_schemeshowright表
create table if not exists frame_schemeshowright
(
     rowguid   varchar(50) not null primary key,
     schemeguid   varchar(50),
     allowtype   varchar(50),
     allowto   varchar(50),
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加frame_table_right表
create table if not exists frame_table_right
(
     rowguid   varchar(50) not null primary key,
     tableid   int,
     righttype varchar(10),
     allowtype   varchar(50),
     allowto   varchar(50),
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加frame_tablestruct_right表
create table if not exists frame_tablestruct_right
(
     rowguid   varchar(50) not null primary key,
     tableid   int,
     fieldguid  varchar(50),
     righttype varchar(10),
     allowtype   varchar(50),
     allowto   varchar(50),
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加排序方案主表frame_schemeorder表
create table if not exists frame_schemeorder
(
     rowguid   varchar(50) not null primary key,
     schemename varchar(50),
     tableid   int,
     ordernumber int,
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加排序方案明细表frame_schemeorder表
create table if not exists frame_schemeorderinfo
(
     rowguid   varchar(50) not null primary key,
     schemeguid varchar(50),
     fieldguid   varchar(50),
     ordertype varchar(50),
     ordernumber int,
     createuserguid  varchar(50),
     createdate  datetime
);
GO

-- 添加表显示方案表frame_schemetableshow
create table if not exists frame_schemetableshow
(
     rowguid   varchar(50) not null primary key,
     parenttableid int,
     tableid int,
     ordernumber int,
     isvisible varchar(5),
     createuserguid  varchar(50),
     createdate  datetime
);
GO


-- DELIMITER ; --
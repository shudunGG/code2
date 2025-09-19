-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/26
-- 新增表epointsform_tablerelation --【薛炳】
 
-- 添加表epointsform_tablerelation
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_tablerelation'))
create table epointsform_tablerelation
   (
    rowguid     nvarchar(50) not null primary key,
    businesstableid     nvarchar(1000),
	shareguid     nvarchar(50),
	baseouguid     nvarchar(50),
	ordernumber     int,
	multitablename   nvarchar(100),
	templateguid     nvarchar(50)
    );
GO

-- 添加表epointsform_designtemp
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_designtemp'))
create table epointsform_designtemp
   (
    rowguid     nvarchar(50) not null primary key,
    templatename    nvarchar(200),
	jsoncontent     text,
	htmlcontent     text,
	ordernumber     int,
	templatetype    nvarchar(50)
    );
GO


 
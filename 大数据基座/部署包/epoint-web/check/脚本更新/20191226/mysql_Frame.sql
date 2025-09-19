-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/12/26
-- 新增表epointsform_tablerelation --【薛炳】
 

-- 添加表epointsform_tablerelation
create table if not exists epointsform_tablerelation
(
  rowguid nvarchar(50) not null primary key,
  businesstableid nvarchar(1000),
  shareguid nvarchar(50),
  baseouguid nvarchar(50),
  ordernumber int,
  multitablename nvarchar(100),
  templateguid nvarchar(50)
);
GO

-- 添加表epointsform_designtemp
create table if not exists epointsform_designtemp
(
  rowguid nvarchar(50) not null primary key,
  templatename nvarchar(200),
  jsoncontent longtext,
  htmlcontent longtext,
  ordernumber int,
  templatetype nvarchar(50) 
);
GO

-- DELIMITER ; --
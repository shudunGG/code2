-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/7/13 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加表
create table if not exists epointsform_parameter
(
  mpGuid    nvarchar(100) not null primary key,
  methodGuid   nvarchar(100),
  mpName   nvarchar(100),
  mpType   int,
  mpValue   nvarchar(1000),
  encrypt  nvarchar(2),
  orderNum  int,
  mpnamedescription nvarchar(100),
  mpvaluedescription  nvarchar(100),
  note   nvarchar(1000),
  backa  nvarchar(100),
  backb  nvarchar(100)
);
GO



-- DELIMITER ; --
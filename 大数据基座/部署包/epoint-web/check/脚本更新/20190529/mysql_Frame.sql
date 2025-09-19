-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/5/29 
-- 添加frame_lessee表 --王颜
create table if not exists frame_lessee
(
  RowGuid  nvarchar(100) not null primary key,
  lesseename   nvarchar(100),
  lesseesysname  nvarchar(100),
  ouGuid nvarchar(100),
  ordernumber INTEGER
);

GO
-- DELIMITER ; --
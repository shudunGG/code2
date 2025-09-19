-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/02/12
 
-- 添加表epointsformuniversal
create table if not exists epointsformuniversal
(
  rowguid varchar(50) not null primary key,
  encodename varchar(50),
  name varchar(50),
  controltype varchar(50),
  ordernumber int,
  businesstype varchar(50),
  isenabled   varchar(10),
  fieldtype   varchar(10),
  context text
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- DELIMITER ; --
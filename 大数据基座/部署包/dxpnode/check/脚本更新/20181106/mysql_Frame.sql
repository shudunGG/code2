-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/11/06
-- 之前勿删的table_visit_allowto，现在再加回来 --徐剑

-- 添加表
create table if not exists table_visit_allowto
(
  row_id                int not null primary key,
  tableid               int,
  operatecode           varchar(50),
  allowto               varchar(50),
  allowtype             varchar(50),
  templateid            int,
  templateid_sub        int,
  queryid               int
);
GO

-- DELIMITER ; --
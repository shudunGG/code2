-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/24
-- 陈星怡

-- 添加app_frameconfig_relation
create table if not exists app_frameconfig_relation
(
  rowguid        nvarchar(50) not null primary key,
  appguid        nvarchar(50),
  configname     nvarchar(100)
);
GO

-- DELIMITER ; --
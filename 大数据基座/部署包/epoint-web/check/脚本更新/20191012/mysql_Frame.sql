-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/10/12
-- 【增量日志表】 --【何晓瑜】

-- 新建表
create table if not exists app_sync_log (
  rowguid     varchar(50) not null,
  appsyncflag varchar(50),
  updatetime  datetime,
  appkey      varchar(50),
  status      int(11),
  primary key (rowguid)
);
GO

-- DELIMITER ; --
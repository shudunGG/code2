-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/05/23 【时间】
-- 【excel导入历史查询表】 --【严璐琛】

-- 新建表
create table if not exists excel_import_history (
  belongxiaqucode varchar(50) default null,
  operateusername varchar(50) default null,
  operatedate datetime default null,
  row_id int(11) default null,
  yearflag varchar(4) default null,
  rowguid varchar(50) not null,
  importuserguid varchar(50) default null,
  attachguid varchar(50) default null,
  attachmd5 varchar(50) default null,
  importresult varchar(500) default null,
  importdetail longtext,
  primary key (rowguid)
);
GO

-- DELIMITER ; --
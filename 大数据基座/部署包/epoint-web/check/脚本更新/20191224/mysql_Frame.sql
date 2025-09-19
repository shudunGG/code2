-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/12/24
-- 新增表epointsform_share_config --【季宇杰】
-- 新增表epointsform_field_config --【季宇杰】
-- 新增表epointsform_table_config --【季宇杰】
-- 新增表epointsform_fieldrelation --【季宇杰】


-- 添加表epointsform_share_config
create table if not exists epointsform_share_config
(
  rowguid varchar(50) not null primary key,
  sharename varchar(100) not null,
  ordernumber int
);
GO

-- 添加表epointsform_field_config
create table if not exists epointsform_field_config
(
  rowguid varchar(50) not null primary key,
  fieldname varchar(100) not null,
  fieldchinesename varchar(100) not null,
  fieldtype varchar(50),
  ordernumber int,
  shareguid varchar(50) not null
);
GO

-- 添加表epointsform_table_config
create table if not exists epointsform_table_config
(
  rowguid varchar(50) not null primary key,
  formname varchar(100) not null,
  formid varchar(100) not null,
  formguid varchar(50) not null,
  tableid int not null,
  ordernumber int,
  shareguid varchar(50) not null
);
GO

-- 添加表epointsform_fieldrelation
create table if not exists epointsform_fieldrelation
(
  rowguid varchar(50) not null primary key,
  formguid varchar(100) not null,
  configguid varchar(100) ,
  tableid int not null,
  ordernumber int,
  shareguid varchar(50) not null,
  fieldname varchar(100) not null,
  fieldcname varchar(100) not null,
  sharefieldname varchar(100) not null,
  sharefieldcname varchar(100) not null
);
GO

-- DELIMITER ; --
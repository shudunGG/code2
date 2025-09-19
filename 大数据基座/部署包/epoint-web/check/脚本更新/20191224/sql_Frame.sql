-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/12/24 【时间】
-- 添加表epointsform_share_config、epointsform_field_config、epointsform_table_config、epointsform_fieldrelation --【季宇杰】

-- 添加epointsform_share_config表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_share_config'))
create table epointsform_share_config
   (
 			   rowguid nvarchar(50) not null primary key,
			   sharename nvarchar(100) not null,
			   ordernumber int
    );
GO

-- 添加epointsform_field_config表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_field_config'))
create table epointsform_field_config
   (
  			   rowguid nvarchar(50) not null primary key,
  			   fieldname nvarchar(100) not null,
			   fieldchinesename nvarchar(100) not null,
			   fieldtype nvarchar(50),
			   ordernumber int,
			   shareguid nvarchar(50) not null
    );
GO

-- 添加表epointsform_table_config表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_table_config'))
create table epointsform_table_config
   (
			   rowguid nvarchar(50) not null primary key,
			   formname nvarchar(100) not null,
			   formid nvarchar(100) not null,
			   formguid nvarchar(50) not null,
			   tableid int not null,
			   ordernumber int,
			   shareguid nvarchar(50) not null
    );
GO

-- 添加表epointsform_fieldrelation表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_fieldrelation'))
create table epointsform_fieldrelation
   (
			   rowguid nvarchar(50) not null primary key,
			   formguid nvarchar(100) not null,
			   configguid nvarchar(100) ,
			   tableid int not null,
			   ordernumber int,
			   shareguid nvarchar(50) not null,
			   fieldname nvarchar(100) not null,
			   fieldcname nvarchar(100) not null,
			   sharefieldname nvarchar(100) not null,
			   sharefieldcname nvarchar(100) not null
    );
GO


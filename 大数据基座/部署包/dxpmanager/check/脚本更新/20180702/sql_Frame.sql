-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/07/02 
-- 新增开放平台配置表, token表--【施佳炜】
if not exists (select * from dbo.sysobjects where id = object_id('frame_open_platform_config'))
CREATE TABLE frame_open_platform_config(
  configname nvarchar(100),
  configvalue nvarchar(500),
  description nvarchar(2000),
  relationguid nvarchar(50),
  platform nvarchar(50),
  rowguid nvarchar(50) NOT NULL primary key
);
GO

if not exists (select * from dbo.sysobjects where id = object_id('sso_token_info'))
CREATE TABLE sso_token_info(
  rowguid nvarchar(50) NOT NULL primary key,
  keystr nvarchar(50),
  clientid nvarchar(50),
  principal nvarchar(100),
  userguid nvarchar(50),
  refreshtoken nvarchar(50),
  sessionid nvarchar(50),
  exin integer,
  createtime datetime,
  scope nvarchar(1000),
  apis text,
  type nvarchar(50)
);
GO

-- DELIMITER ; --
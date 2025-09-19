-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/12/17
-- 徐剑

-- app_info添加issyncuserconfig字段
if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncuserconfig' ) 
alter table app_info add issyncuserconfig int; 
GO

-- 添加app_userconfig_relation
if not exists (select * from dbo.sysobjects where id = object_id('app_userconfig_relation'))
create table app_userconfig_relation
   (
      rowguid        nvarchar(50) not null primary key,
      appguid        nvarchar(50),
      configname     nvarchar(100)
    );
GO

-- 添加frame_userconfig_snapshot
if not exists (select * from dbo.sysobjects where id = object_id('frame_userconfig_snapshot'))
create table frame_userconfig_snapshot
   (
      rowguid             nvarchar(50) not null primary key,
      userconfigguid      nvarchar(100),
      belonguserguid      nvarchar(100),
      configname          nvarchar(100),
      configvalue         nvarchar(500),
      configguid          nvarchar(100),
      updatetime          datetime,
      appkey              nvarchar(50),
      clientip            nvarchar(50)
    );
GO

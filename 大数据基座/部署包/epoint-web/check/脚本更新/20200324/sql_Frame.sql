-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/24
-- 陈星怡

-- 添加app_frameconfig_relation
if not exists (select * from dbo.sysobjects where id = object_id('app_frameconfig_relation'))
create table app_frameconfig_relation
   (
      rowguid        nvarchar(50) not null primary key,
      appguid        nvarchar(50),
      configname     nvarchar(100)
    );
GO

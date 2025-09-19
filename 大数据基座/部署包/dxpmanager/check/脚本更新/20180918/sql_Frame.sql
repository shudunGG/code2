-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/9/18
-- 一级菜单排序表 --季立霞

if not exists (select * from dbo.sysobjects where id = object_id('frame_topModuleSort'))
create table frame_topModuleSort
   (
   rowguid              nvarchar(50) not null primary key,
   moduleguid           nvarchar(50),
   userguid             nvarchar(50),
   ordernumber          int
    );
GO

-- 模块点击频率表
if not exists (select * from dbo.sysobjects where id = object_id('frame_moduleFrequency'))
create table frame_moduleFrequency
   (
   rowguid              nvarchar(50) not null primary key,
   moduleguid           nvarchar(50),
   userguid             nvarchar(50),
   count                int
    );
GO
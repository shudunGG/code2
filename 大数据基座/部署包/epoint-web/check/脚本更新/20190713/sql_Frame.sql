-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/7/13 【时间】
-- 【内容简单介绍】 --季立霞

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('epointsform_parameter'))
create table epointsform_parameter
   (
    mpGuid    nvarchar(100) not null primary key,
    methodGuid   nvarchar(100),
    mpName   nvarchar(100),
    mpType   int,
    mpValue   nvarchar(1000),
    encrypt  nvarchar(2),
    orderNum  int,
    mpnamedescription nvarchar(100),
    mpvaluedescription  nvarchar(100),
    note   nvarchar(1000),
    backa  nvarchar(100),
    backb  nvarchar(100)
    );
GO

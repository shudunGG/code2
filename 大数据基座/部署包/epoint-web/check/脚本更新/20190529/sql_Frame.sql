-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/5/29 
-- 添加frame_lessee表 --王颜

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('frame_lessee'))
create table frame_lessee
   (
     RowGuid  nvarchar(100) not null primary key,
     lesseename   nvarchar(100),
     lesseesysname  nvarchar(100),
     ouGuid nvarchar(100),
     ordernumber INTEGER
    );
GO

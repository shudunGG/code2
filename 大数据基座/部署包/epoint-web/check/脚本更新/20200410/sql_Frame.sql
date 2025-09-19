-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/09
-- 添加表workflow_transactor_sequence --陈端一
if not exists (select * from dbo.sysobjects where id = object_id('workflow_transactor_sequence'))
create table workflow_transactor_sequence
(
  sequenceGuid nvarchar(50) not null primary key,
  pviGuid      nvarchar(50),
  transactor   nvarchar(50),
  transactorName nvarchar(50),
  ouGuid         nvarchar(50),
  operationDate datetime,
  tag           int,
  activityGuid nvarchar(50),
  workItemGuid nvarchar(50),
  orderNum     int,
  note         nvarchar(500),
  clientGuid   nvarchar(100)
);
GO

-- 2020/04/10
-- 已存在frame_lessee表，只需要向表中添加username，password，del_flag字段

if not exists (select name from syscolumns  where id = object_id('frame_lessee') and name='username') 
alter table frame_lessee add username nvarchar(100); 
GO
if not exists (select name from syscolumns  where id = object_id('frame_lessee') and name='password') 
alter table frame_lessee add password nvarchar(500); 
GO
if not exists (select name from syscolumns  where id = object_id('frame_lessee') and name='del_flag') 
alter table frame_lessee add del_flag nvarchar(1); 
GO

-- 2020/04/10
-- 添加表frame_lesseedata --刘飞龙
if not exists (select * from dbo.sysobjects where id = object_id('frame_lesseedata'))
create table frame_lesseedata (
    RowGuid nvarchar(100) not null primary key,
    lesseeguid nvarchar(100),
    classname nvarchar(100),
    strategy nvarchar(100),
    lastdate datetime,
    orderNumber int,
    del_flag nvarchar(1)
);
GO
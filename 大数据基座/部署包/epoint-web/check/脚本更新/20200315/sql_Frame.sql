-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/15
-- 添加表frame_attachrightconfig   --吴琦
if not exists (select * from dbo.sysobjects where id = object_id('frame_attachrightconfig'))
create table frame_attachrightconfig
(
  OperateDate datetime null,
  RowGuid nvarchar(50) not null primary key,
  verifytype nvarchar(50) null,
  verifyto nvarchar(2000) null,
  isenabled int null
);
GO


-- 添加表frame_attachrightinfo   --吴琦
if not exists (select * from dbo.sysobjects where id = object_id('frame_attachrightinfo'))
create table frame_attachrightinfo
(
  RowGuid nvarchar(50) not null primary key,
  attachrightguid nvarchar(50) null,
  allowtype nvarchar(100) null,
  allowto nvarchar(100) null,
  isenabled int null,
  righttype nvarchar(50) null
);
GO
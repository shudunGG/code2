-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/04
-- 添加表frame_operateratelimit_config   --吴琦

if not exists (select * from dbo.sysobjects where id = object_id('frame_operateratelimit_config'))
create table frame_operateratelimit_config
(
  OperateUserName nvarchar(50) null,
  OperateDate datetime null,
  RowGuid nvarchar(50) not null primary key,
  OperateUserGuid nvarchar(50) null,
  PolicyRemark nvarchar(200) null,
  TargetUserGuid nvarchar(50) null,
  TargetUserName nvarchar(50) null,
  PageUrl nvarchar(500) not null,
  TimeInterval int null,
  MaxCount int null,
  VerificationMode nvarchar(50) null,
  PolicyValidPeriod int null,
  PolicyEnabled int null
);
GO

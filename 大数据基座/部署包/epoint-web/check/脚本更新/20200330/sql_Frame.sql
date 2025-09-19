-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/30
-- 添加表frame_sms_verification   --吴琦
if not exists (select * from dbo.sysobjects where id = object_id('frame_sms_verification'))
create table frame_sms_verification
(
  RowGuid nvarchar(50) not null primary key,
  OperateUserGuid nvarchar(50) null,
  smscode nvarchar(50) null,
  smsno nvarchar(50) null,
  createtime datetime null,
  mobilenumber nvarchar(50) null,
  isuesed int null,
  verifytime datetime null,
  verifyIP nvarchar(50) null
);
GO


-- 添加表frame_restricted_info   --吴琦
if not exists (select * from dbo.sysobjects where id = object_id('frame_restricted_info'))
create table frame_restricted_info
(
  RowGuid nvarchar(50) not null primary key,
  RestrictedType nvarchar(50) null,
  RestrictedCreateTime datetime null,
  IsManualTerminate int null,
  AutoTerminateTime datetime null,
  ManualTerminateTime datetime null,
  UserGuid nvarchar(50) null,
  RestrictedObj nvarchar(50) null
);
GO
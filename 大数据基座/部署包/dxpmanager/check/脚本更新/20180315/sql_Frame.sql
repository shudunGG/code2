-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/03/15
--新增用户锁定表--周志豪
if not exists (select * from dbo.sysobjects where id = object_id('frame_login_lockinfo'))
create table frame_login_lockinfo (
  rowguid varchar(50) not null primary key,
  lockeditem varchar(50),
  lockedloginid varchar(50),
  lockeduserguid varchar(50),
  lockedtime datetime ,
  clearlockedtime datetime, 
  ishandunlock varchar(50),
  handunlocktime datetime
)
GO


-- 添加动态口令表 --周志豪
if not exists (select * from dbo.sysobjects where id = object_id('frame_onetime_pwd'))
create table frame_onetime_pwd (
  rowguid VARCHAR(50) not null,
  loginid VARCHAR(50),
  efftime date,
  onetimepassword VARCHAR(50)
);
alter table frame_onetime_pwd add primary key (rowguid);
GO

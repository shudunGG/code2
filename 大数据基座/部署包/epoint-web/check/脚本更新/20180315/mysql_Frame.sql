-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO -- 

-- 2018/03/15

-- 新增用户锁定表 --周志豪
create table if not exists frame_login_lockinfo (
  rowguid varchar(50) not null primary key,
  lockeditem varchar(50),
  lockedloginid varchar(50),
  lockeduserguid varchar(50),
  lockedtime datetime ,
  clearlockedtime datetime, 
  ishandunlock varchar(50),
  handunlocktime datetime
);
GO

-- 添加动态口令表 --周志豪
create table if not exists frame_onetime_pwd (
  rowguid varchar(50),
  loginid varchar(50),
  efftime datetime,
  onetimepassword varchar(50)
);
GO

-- DELIMITER ; -- 
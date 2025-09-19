-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/12/2
-- 新增表frame_login_statistics --【俞俊男】

-- 添加表
create table if not exists frame_login_statistics
(
  rowguid nvarchar(50) not null primary key,
  loginid nvarchar(100),
  failnum int,
  successnum int,
  lastlogintime datetime,
  lastfreqrecordtime datetime,
  platform nvarchar(50)
);
GO


-- DELIMITER ; --
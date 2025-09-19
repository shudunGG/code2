-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/10/31 【时间】
-- 添加表frame_user_password_modifylog --【何晓瑜】
create table if not exists frame_user_password_modifylog
(
  rowguid nvarchar(50) not null primary key,
  updatetime datetime,
  userguid nvarchar(50) not null,
  lastpwd nvarchar(200) not null
);
GO
-- DELIMITER ; --
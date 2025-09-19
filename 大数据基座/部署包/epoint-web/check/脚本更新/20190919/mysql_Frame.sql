-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/09/19 【时间】
-- 添加表frame_user_dingtalk、frame_ou_dingtalk --【何晓瑜】

-- frame_ou_dingtalk
create table if not exists frame_ou_dingtalk
(
  ouguid  nvarchar(50) not null primary key,
  dingtalkouid  bigint(20)
);
GO


-- frame_user_dingtalk
create table if not exists frame_user_dingtalk
(
  dingtalkunionid  nvarchar(50) not null primary key,
  userguid  nvarchar(50),
  dingtalkuserid nvarchar(50)
);
GO

-- DELIMITER ; --
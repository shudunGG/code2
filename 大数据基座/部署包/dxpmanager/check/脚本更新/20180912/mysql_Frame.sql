-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/09/12
-- 二维码登录数据表-- 季立霞

-- 添加表
create table if not exists frame_qrcode
(
  rowguid         nvarchar(50) not null primary key,
  code            nvarchar(50),
  token           nvarchar(50),
  status          int(11),
  scantime        datetime
);
GO

-- DELIMITER ; --
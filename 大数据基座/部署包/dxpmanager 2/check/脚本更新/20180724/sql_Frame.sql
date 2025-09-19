-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/07/24 【时间】
-- 企业微信组织架构同步，新增1个部门id对照表（frame_ou_weixin）--何晓瑜
if not exists (select * from dbo.sysobjects where id = object_id('frame_ou_weixin'))
create table frame_ou_weixin(
  ouguid nvarchar(50) NOT NULL,
  id int NOT NULL primary key
);
GO

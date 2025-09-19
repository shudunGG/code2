-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/03/20
-- -- 添加应用附件数据源关联关系表
if exists (select * from dbo.sysobjects where id = object_id('app_attachconfig'))
drop table app_attachconfig;
GO
CREATE TABLE app_attachconfig (
  rowguid VARCHAR(50) not null,
  appguid VARCHAR(50),
  configguid VARCHAR(50),
  ordernumber int
);
alter table app_attachconfig add primary key (rowguid);
GO

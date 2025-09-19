-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/10/12
-- 【增量日志表】 --【何晓瑜】

-- 添加字段示例 
if not exists (select * from dbo.sysobjects where id = object_id('app_sync_log'))
create table app_sync_log
(   
   rowguid     nvarchar(50) not null primary key,
   appsyncflag nvarchar(50) null,
   updatetime  datetime,
   appkey      nvarchar(50) null,
   status      int
);
GO

-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/04/24 【时间】
-- 添加epoint_job_manager_config-- 吴俊涛
if not exists (select * from dbo.sysobjects where id = object_id('epoint_job_manager_config'))
CREATE TABLE epoint_job_manager_config (
  rowguid nvarchar(50) not null primary key,
  configname nvarchar(100),
  configvalue nvarchar(512) 
);
GO
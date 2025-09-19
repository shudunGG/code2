-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/19
-- 工作流活动表添加多人处理锁定锁定时间字段 --季立霞

-- 添加多人处理锁定锁定时间字段
if not exists (select name from syscolumns  where id = object_id('workflow_activity') and name='locktimewhenmultitransactor' ) 
 alter table workflow_activity add locktimewhenmultitransactor nvarchar(100);
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/08/07
-- 工作流部门岗位逻辑相关功能添加字段 --季立霞

-- 角色添加是否是职位标记字段
if not exists (select name from syscolumns  where id = object_id('frame_role') and name='isjobflag' ) 
 alter table frame_role add isjobflag nvarchar(4);
GO


-- 角色快照表添加是否是职位标记字段
if not exists (select name from syscolumns  where id = object_id('frame_role_snapshot') and name='isjobflag' ) 
 alter table frame_role_snapshot add isjobflag nvarchar(4);
GO

-- 活动预处理人表添加角色guid字段
if not exists (select name from syscolumns  where id = object_id('workflow_participator') and name='roleguid' ) 
 alter table workflow_participator add roleguid nvarchar(100);
GO

-- 工作项表添加角色guid字段
if not exists (select name from syscolumns  where id = object_id('workflow_workitem') and name='roleguid' ) 
 alter table workflow_workitem add roleguid nvarchar(100);
GO

-- 工作项历史表添加角色guid字段
if not exists (select name from syscolumns  where id = object_id('workflow_workitem_history') and name='roleguid' ) 
 alter table workflow_workitem_history add roleguid nvarchar(100);
GO

-- 待办表添加角色guid字段
if not exists (select name from syscolumns  where id = object_id('messages_center') and name='roleguid' ) 
 alter table messages_center add roleguid nvarchar(100);
GO

-- 待办历史表添加角色guid字段
if not exists (select name from syscolumns  where id = object_id('messages_center_histroy') and name='roleguid' ) 
 alter table messages_center_histroy add roleguid nvarchar(100);
GO


if not exists (select * from information_schema.columns  where  table_name = 'api_info' and column_name='gkyUrl') 
alter table api_info add gkyUrl nvarchar(10); 
GO



-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/06/19
-- workflow_processversion表添加baseouguid --季晓伟
-- frame_ip_lockinfo表添加CreateDate、UpdateDate -- 俞俊男

-- frame_ip_lockinfo表添加CreateDate、UpdateDate
if not exists (select * from information_schema.columns  where  table_name = 'frame_ip_lockinfo' and column_name='CreateDate') 
alter table frame_ip_lockinfo add CreateDate datetime; 
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_ip_lockinfo' and column_name='UpdateDate') 
alter table frame_ip_lockinfo add UpdateDate datetime; 
GO

-- 删除表epointsformtemplate字段 --【薛炳】
if  exists (select * from information_schema.columns  where  table_name = 'epointsformtemplate' and column_name='MobileWorkflowDetailTemplateUrl') 
alter table epointsformtemplate drop column MobileWorkflowDetailTemplateUrl;  
GO
-- epointsformtemplate表添加mobilewfdetailtemplateurl
if not exists (select * from information_schema.columns  where  table_name = 'epointsformtemplate' and column_name='mobilewfdetailtemplateurl') 
alter table epointsformtemplate add mobilewfdetailtemplateurl nvarchar(100); 
GO

 
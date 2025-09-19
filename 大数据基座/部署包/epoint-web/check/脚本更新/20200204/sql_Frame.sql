-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/02/04
-- 表单版本表中增加移动端设计数据字段 --【薛炳】

if not exists (select name from syscolumns  where id = object_id('epointformversion') and name='mobiledesigndata' ) 
alter table epointformversion add mobiledesigndata  text; 
GO

 -- epointsformtemplate表添加WorkflowDetailTemplateUrl
if not exists (select * from information_schema.columns  where  table_name = 'epointsformtemplate' and column_name='WorkflowDetailTemplateUrl') 
alter table epointsformtemplate add WorkflowDetailTemplateUrl nvarchar(100); 
GO


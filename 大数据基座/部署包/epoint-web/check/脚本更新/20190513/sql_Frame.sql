-- 所有脚本可直接复制到sql server查询设计器中执行

-- 删除表appmanage_publicelement字段 --【陈端一】
if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='TitleFieldName') 
alter table appmanage_publicelement drop column TitleFieldName;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='YFieldName') 
alter table appmanage_publicelement drop column YFieldName;  
GO
if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='XFieldName') 
alter table appmanage_publicelement drop column XFieldName;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='IsDisable') 
alter table appmanage_publicelement drop column IsDisable;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='ChartType') 
alter table appmanage_publicelement drop column ChartType;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='GridShowField') 
alter table appmanage_publicelement drop column GridShowField;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='IconStore') 
alter table appmanage_publicelement drop column IconStore;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='PortaletType') 
alter table appmanage_publicelement drop column PortaletType;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='SSOUrl') 
alter table appmanage_publicelement drop column SSOUrl;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='MoreButtonLinkUrl') 
alter table appmanage_publicelement drop column MoreButtonLinkUrl;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='AllowMoreButton') 
alter table appmanage_publicelement drop column AllowMoreButton;  
GO

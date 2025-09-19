-- 所有脚本可直接复制到sql server查询设计器中执行

-- 删除表EpointsformTemplate字段 --【薛炳】
if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='accordionaddurl') 
alter table EpointsformTemplate drop column accordionaddurl;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='accordionwfurl') 
alter table EpointsformTemplate drop column accordionwfurl;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='accordiondetailurl') 
alter table EpointsformTemplate drop column accordiondetailurl;  
GO

if  exists (select * from information_schema.columns  where  table_name = 'EpointsformTemplate' and column_name='accordionprinturl') 
alter table EpointsformTemplate drop column accordionprinturl;  
GO

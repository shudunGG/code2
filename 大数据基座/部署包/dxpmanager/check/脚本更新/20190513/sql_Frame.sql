-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/05/13
-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='TitleFieldName') 
alter table appmanage_publicelement drop TitleFieldName; 
GO

-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='YFieldName') 
alter table appmanage_publicelement drop YFieldName; 
GO

-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='XFieldName') 
alter table appmanage_publicelement drop XFieldName; 
GO


-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='IsDisable') 
alter table appmanage_publicelement drop IsDisable; 
GO


-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='ChartType') 
alter table appmanage_publicelement drop ChartType; 
GO


-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='GridShowField') 
alter table appmanage_publicelement drop GridShowField; 
GO


-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='IconStore') 
alter table appmanage_publicelement drop IconStore; 
GO


-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='SSOUrl') 
alter table appmanage_publicelement drop SSOUrl; 
GO

-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='MoreButtonLinkUrl') 
alter table appmanage_publicelement drop MoreButtonLinkUrl; 
GO

-- appmanage_publicelement去除字段 --cdy
if  exists (select name from syscolumns  where id = object_id('appmanage_publicelement') and name='AllowMoreButton') 
alter table appmanage_publicelement drop AllowMoreButton; 
GO
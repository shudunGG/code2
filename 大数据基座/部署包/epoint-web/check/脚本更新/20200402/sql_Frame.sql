-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/02 
-- 删除视图view_appmanage_myapp,view_appmanage_appinfo_right,view_appmanage_element_right,view_appmanage_myelement

-- 删除view_appmanage_myapp
if  exists (select * from sys.views where object_id = object_id('view_appmanage_myapp'))
drop view view_appmanage_myapp;
GO

-- 删除view_appmanage_appinfo_right
if  exists (select * from sys.views where object_id = object_id('view_appmanage_appinfo_right'))
drop view view_appmanage_appinfo_right;
GO

-- 删除view_appmanage_element_right
if  exists (select * from sys.views where object_id = object_id('view_appmanage_element_right'))
drop view view_appmanage_element_right;
GO

-- 删除view_appmanage_myelement
if  exists (select * from sys.views where object_id = object_id('view_appmanage_myelement'))
drop view view_appmanage_myelement;
GO

-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/02 
-- 删除视图view_appmanage_myapp,view_appmanage_appinfo_right,view_appmanage_element_right,view_appmanage_myelement --陈星怡


-- 删除view_appmanage_myapp
drop view if exists view_appmanage_myapp;
GO

-- 删除view_appmanage_appinfo_right
drop view if exists view_appmanage_appinfo_right;
GO

-- 删除view_appmanage_element_right
drop view if exists view_appmanage_element_right;
GO

-- 删除view_appmanage_myelement
drop view if exists view_appmanage_myelement;
GO


-- DELIMITER ; --
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/03/27 
-- 【删除表】  --【陈星怡】

-- 删除表appmanage_appinfo
drop table if exists appmanage_appinfo;
GO

-- 删除表appmanage_pa_unload
drop table if exists appmanage_pa_unload;
GO

-- 删除表frame_desktop_manage
drop table if exists frame_desktop_manage;
GO

-- 删除表frame_desktopright
drop table if exists frame_desktopright;
GO

-- 删除表appmanage_personalapp
drop table if exists appmanage_personalapp;
GO

-- 删除表appmanage_publicelement
drop table if exists appmanage_publicelement;
GO

-- 删除表appmanage_elementright
drop table if exists appmanage_elementright;
GO

-- 删除表appmanage_personalelement
drop table if exists appmanage_personalelement;
GO

-- DELIMITER ; --
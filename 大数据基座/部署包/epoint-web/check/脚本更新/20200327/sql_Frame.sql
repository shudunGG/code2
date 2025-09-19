-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/27 
-- 【删除表】  --【陈星怡】

-- 删除表appmanage_appinfo
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_appinfo'))
drop table appmanage_appinfo;
GO

-- 删除表appmanage_pa_unload
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_pa_unload'))
drop table appmanage_pa_unload;
GO

-- 删除表frame_desktop_manage
if  exists (select * from dbo.sysobjects where id = object_id('frame_desktop_manage'))
drop table frame_desktop_manage;
GO

-- 删除表frame_desktopright
if  exists (select * from dbo.sysobjects where id = object_id('frame_desktopright'))
drop table frame_desktopright;
GO

-- 删除表appmanage_personalapp
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_personalapp'))
drop table appmanage_personalapp;
GO

-- 删除表appmanage_publicelement
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_publicelement'))
drop table appmanage_publicelement;
GO

-- 删除表appmanage_elementright
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_elementright'))
drop table appmanage_elementright;
GO

-- 删除表appmanage_personalelement
if  exists (select * from dbo.sysobjects where id = object_id('appmanage_personalelement'))
drop table appmanage_personalelement;
GO
-- 所有脚本可直接复制到sql server查询设计器中执行
-- 菜单配置功能表添加 -- 俞俊男

-- 添加用户菜单表
if not exists (select * from dbo.sysobjects where id = object_id('frame_personal_menu'))
create table frame_personal_menu
   (
    rowguid  nvarchar(100) NOT NULL primary key,
    userguid  nvarchar(100) NOT NULL ,
	relatedguid  nvarchar(100) NOT NULL ,
	menuType  int NOT NULL ,
	orderNumber  int NULL
    );
GO

-- 添加系统菜单表
if not exists (select * from dbo.sysobjects where id = object_id('frame_sys_menu'))
create table frame_sys_menu
   (
    rowguid  nvarchar(100) NOT NULL primary key,
	relatedguid  nvarchar(100) NOT NULL ,
	menuType  int NOT NULL ,
	orderNumber  int NULL
    );
GO

-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 菜单配置功能表添加 --俞俊男

-- 添加用户菜单表
create table if not exists frame_personal_menu
(
    rowguid  varchar(100) NOT NULL primary key,
    userguid  varchar(100) NOT NULL ,
	relatedguid  varchar(100) NOT NULL ,
	menuType  int NOT NULL ,
	orderNumber  int NULL  
);
GO

-- 添加系统菜单表
create table if not exists frame_sys_menu
(
    rowguid  varchar(100) NOT NULL primary key,
	relatedguid  varchar(100) NOT NULL ,
	menuType  int NOT NULL ,
	orderNumber  int NULL  
);
GO

-- DELIMITER ; --
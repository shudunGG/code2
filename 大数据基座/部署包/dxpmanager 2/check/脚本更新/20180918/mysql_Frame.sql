-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/9/18
-- 一级菜单排序表 --季立霞

create table if not exists frame_topModuleSort
(
	rowguid varchar(50) NOT NULL PRIMARY KEY,
	moduleguid varchar(50),
	userguid varchar(50),
	ordernumber INT
);
GO

-- 模块点击频率表
create table if not exists frame_modulefrequency
(
	rowguid varchar(50) NOT NULL PRIMARY KEY,
	userguid varchar(50),
	moduleguid varchar(50),
	count INT
);
GO


-- DELIMITER ; --
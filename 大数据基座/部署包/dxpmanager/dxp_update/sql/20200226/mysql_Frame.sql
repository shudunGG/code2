--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

--添加任务关联表
create table dxp_flow_relate(
	rowguid varchar(50) not null,
	flowguid varchar(50)  not null,
	relateflowguid varchar(50)  not null,
	relateTime datetime  not null,
	 PRIMARY KEY (`rowguid`)
);
-- DELIMITER ; --
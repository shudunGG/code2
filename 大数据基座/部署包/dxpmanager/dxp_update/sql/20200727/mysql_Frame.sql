--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

update frame_module set MODULECODE='0008',ORDERNUMBER='85',BIGICONADDRESS='modicon-33;' where MODULEGUID='fc5f2fc6-4e31-4718-b19e-d3b7c5767a27';

GO

alter table dxp_flow_info add column isdagchild int default 0;

-- DELIMITER ; --
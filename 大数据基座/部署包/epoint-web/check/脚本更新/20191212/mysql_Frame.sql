-- 所有脚本可直接复制到mysql查询设计器中执行
-- 2019/12/12
-- 将表Epointsform_Table_BasicInfo中的tableid由自增长列改为非自增长列 --wlu
alter table Epointsform_Table_BasicInfo change TABLEID TABLEID int;
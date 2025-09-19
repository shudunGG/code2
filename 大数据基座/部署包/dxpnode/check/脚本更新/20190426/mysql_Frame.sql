-- 所有脚本可直接复制到mysql查询设计器中执行
-- 2019/04/26
-- 将表Table_BasicInfo中的tableid由自增长列改为非自增长列 --陈佳
alter table table_basicinfo change TABLEID TABLEID int;
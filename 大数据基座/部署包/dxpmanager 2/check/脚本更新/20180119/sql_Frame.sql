-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/01/19
-- 用户表中的职务字段清空--王露
if exists (select count(*) from frame_user where title !=null or title !='') 
update frame_user set title ='';
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/4/23

-- 扩展控件信息表extendfieldtwo字段修改长度  --季立霞
if not exists (select name from syscolumns  where id = object_id('epointsform_extensible_control') and name='extendfieldtwo' ) 
alter table epointsform_extensible_control add extendfieldtwo varchar(500);  
else
alter table epointsform_extensible_control 
alter column extendfieldtwo varchar(500);  
GO
-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/8/26

-- 表单版本表epointformversion字段改为50长度 --薛炳
if not exists (select * from information_schema.columns  where  table_name ='epointformversion' and column_name='Version' and character_maximum_length=50) 
alter table epointformversion add Version varchar(50);  
else
alter table epointformversion 
alter column Version varchar(50);  
GO

--列表版本表epointsformlistversion字段改为50长度 --薛炳
if not exists (select * from information_schema.columns  where  table_name ='epointsformlistversion' and column_name='Version' and character_maximum_length=50) 
alter table epointsformlistversion add Version varchar(50);  
else
alter table epointsformlistversion 
alter column Version varchar(50);  
GO
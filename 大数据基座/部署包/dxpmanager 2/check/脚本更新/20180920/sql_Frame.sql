-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/20 
-- 修改原类型为text大字段无必要性的字段为varchar(2000) --季立霞

-- 修改epointsform_table_basicinfo中bak1字段类型
if exists (select * from information_schema.columns  where  table_name = 'epointsform_table_basicinfo' and column_name='bak1') 
alter table epointsform_table_basicinfo 
alter column bak1 varchar(2000);  
GO

-- 修改epointsform_table_struct中bak1字段类型
if exists (select * from information_schema.columns  where  table_name = 'epointsform_table_struct' and column_name='bak1') 
alter table epointsform_table_struct 
alter column bak1 varchar(2000);  
GO
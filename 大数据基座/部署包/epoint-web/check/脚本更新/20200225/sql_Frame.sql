-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/02/25
-- epointsform_designtemp表添加controlsdata
if not exists (select * from information_schema.columns  where  table_name = 'epointsform_designtemp' and column_name='controlsdata') 
alter table epointsform_designtemp add controlsdata text; 
GO



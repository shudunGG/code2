-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/09
-- 添加表frame_schemetableshow表 parenttableid字段 --陈端一
if not exists (select name from syscolumns  where id = object_id('frame_schemetableshow') and name='parenttableid' ) 
alter table frame_schemetableshow add parenttableid int; 
GO

-- 修改typename字段类型为nvarchar
if not exists (select * from information_schema.columns  where  table_name = 'workflow_method' and column_name='typename' and data_type='nvarchar') 
alter table workflow_method 
alter column typename nvarchar(500);  
GO

-- 修改methodname字段类型为nvarchar
if not exists (select * from information_schema.columns  where  table_name = 'workflow_method' and column_name='methodname' and data_type='nvarchar') 
alter table workflow_method 
alter column methodname nvarchar(200);  
GO
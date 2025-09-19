-- 所有脚本可直接复制到sql server查询设计器中执行

-- frame_anti_tamper表新增 datatype、tableid、datamaskingtype字段，修改anticolumns长度--jyjie
if not exists (select name from syscolumns  where id = object_id('frame_anti_tamper') and name='datatype' ) 
alter table frame_anti_tamper add datatype  nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('frame_anti_tamper') and name='tableid' ) 
alter table frame_anti_tamper add tableid  int; 
GO

if not exists (select name from syscolumns  where id = object_id('frame_anti_tamper') and name='datamaskingtype' ) 
alter table frame_anti_tamper add datamaskingtype  nvarchar(500); 
GO

if not exists (select * from information_schema.columns  where  table_name = 'frame_anti_tamper' and column_name='anticolumns' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_anti_tamper 
alter column anticolumns nvarchar(500);  
GO
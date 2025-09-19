-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/01/30
-- 修改frame_attachconfig中的字段类型--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_attachconfig' and column_name = 'sysguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_attachconfig 
alter column sysguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_attachconfig' and column_name = 'attach_connectionstringname' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_attachconfig 
alter column attach_connectionstringname nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_attachconfig' and column_name = 'attach_connectionstring' and data_type='nvarchar' and character_maximum_length=300) 
alter table frame_attachconfig 
alter column attach_connectionstring nvarchar(300); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_attachconfig' and column_name = 'databasetype' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_attachconfig 
alter column databasetype nvarchar(50); 
GO

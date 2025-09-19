-- 所有脚本可直接复制到sql server查询设计器中执行

-- frame_ou_snapshot表修改OrderNumberFull字段长度为1000
-- Frame_UserRole_snapshot表添加ouguid字段 
-- frame_ou_snapshot 表修改oucodelevel字段类型为nvarchar

-- 2020/06/03 陈端一

if not exists (select * from information_schema.columns  where  table_name = 'frame_ou_snapshot' and column_name='ordernumberfull' and data_type='nvarchar' and character_maximum_length=1000) 
alter table frame_ou_snapshot 
alter column ordernumberfull nvarchar(1000);  
GO

-- Frame_UserRole_snapshot表添加ouguid字段 
if not exists (select name from syscolumns  where id = object_id('Frame_UserRole_Snapshot') and name='ouguid') 
alter table Frame_UserRole_Snapshot add ouguid nvarchar(50); 
GO

-- frame_ou_snapshot 表修改oucodelevel字段类型为nvarchar
if exists (select * from information_schema.columns  where  table_name = 'frame_ou_snapshot' and column_name='oucodelevel' and data_type='varchar') 
alter table frame_ou_snapshot 
alter column oucodelevel nvarchar(500);  
GO


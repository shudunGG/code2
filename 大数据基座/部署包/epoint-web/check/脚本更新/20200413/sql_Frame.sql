-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/4/13
if not exists (select name from syscolumns  where id = object_id('messages_center_histroy') and name='tagname' ) 
alter table messages_center_histroy add tagname nvarchar(50); 
GO

if not exists (select name from syscolumns  where id = object_id('messages_center') and name='tagname' ) 
alter table messages_center add tagname nvarchar(50); 
GO
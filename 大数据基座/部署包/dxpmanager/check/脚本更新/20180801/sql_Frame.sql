-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/01
-- frameMyAddressGroup、frame_myaddressgroup_snapshot添加appguid,isfilter字段,删除ouguids字段 --季立霞
-- frameMyAddressBook、frame_myaddressbook_snapshot添加row_id字段  --季立霞

-- 删除ouguids字段
if exists (select name from syscolumns  where id = object_id('Frame_MyAddressGroup') and name='ouguids' ) 
alter table Frame_MyAddressGroup drop column ouguids;
GO

-- 添加appguid字段
if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressGroup') and name='appguid' ) 
 alter table Frame_MyAddressGroup add  appguid varchar(50); 
GO

-- 添加isfilter字段
if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressGroup') and name='isfilter' ) 
 alter table Frame_MyAddressGroup add  isfilter varchar(4); 
GO

-- 添加row_id字段
if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressBook') and name='row_id' ) 
 alter table Frame_MyAddressBook add  row_id int; 
GO



-- 快照删除ouguids字段
if exists (select name from syscolumns  where id = object_id('frame_myaddressgroup_snapshot') and name='ouguids' ) 
 alter table frame_myaddressgroup_snapshot drop column ouguids; 
GO

-- 快照添加appguid字段
if not exists (select name from syscolumns  where id = object_id('frame_myaddressgroup_snapshot') and name='appguid' ) 
 alter table frame_myaddressgroup_snapshot add  appguid varchar(50); 
GO

-- 快照添加isfilter字段
if not exists (select name from syscolumns  where id = object_id('frame_myaddressgroup_snapshot') and name='isfilter' ) 
 alter table frame_myaddressgroup_snapshot add  isfilter varchar(4); 
GO

-- 快照添加row_id字段
if not exists (select name from syscolumns  where id = object_id('frame_myaddressbook_snapshot') and name='row_id' ) 
 alter table frame_myaddressbook_snapshot add  row_id int; 
GO




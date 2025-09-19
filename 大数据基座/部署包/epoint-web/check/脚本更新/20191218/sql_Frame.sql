-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/12/18
-- 修改字段platform的string为int类型--王颜
if exists (select * from information_schema.columns  where  table_name = 'mobile_update' and column_name='platform') 
alter table mobile_update 
alter column platform int;  
GO

-- 添加字段userinfo， 用于保存登录时的用户信息，当用户表中用户被删除时展示出来--王颜
if not exists (select * from information_schema.columns  where table_name = 'mobile_device' and column_name='userinfo' ) 
alter table mobile_device add userinfo  nvarchar(100); 
GO

-- 表单版本表中增加复制数量字段 --【薛炳】
if not exists (select name from syscolumns  where id = object_id('EpointsformTemplate') and name='treetitle' ) 
alter table EpointsformTemplate add treetitle  nvarchar(10); 
GO

if not exists (select name from syscolumns  where id = object_id('table_struct') and name='codeid' ) 
alter table table_struct add codeid  int; 
GO

if not exists (select name from syscolumns  where id = object_id('table_struct') and name='itemid' ) 
alter table table_struct add itemid  int; 
GO

if not exists (select name from syscolumns  where id = object_id('table_struct') and name='columnordernum' ) 
alter table table_struct add columnordernum  int; 
GO

if not exists (select name from syscolumns  where id = object_id('table_struct') and name='beforetableid' ) 
alter table table_struct add beforetableid  int; 
GO


if not exists (select name from syscolumns  where id = object_id('table_basicinfo') and name='mergeformids' ) 
alter table table_basicinfo add mergeformids  nvarchar(100); 
GO


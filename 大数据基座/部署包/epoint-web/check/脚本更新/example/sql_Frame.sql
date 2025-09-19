-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2017/10/20 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('tablename'))
create table tablename
   (
    columnname1     nvarchar(50) not null primary key,
    columnname2     nvarchar(50)
    );
GO

-- 删除表

if  exists (select * from dbo.sysobjects where id = object_id('tablename'))
drop table tablename;
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('tablename') and name='columnname' ) 
alter table tablename add columnname  nvarchar(50); 
GO

-- 修改字段示例
if not exists (select * from information_schema.columns  where  table_name = 'tablename' and column_name='columnname' and data_type='nvarchar' and character_maximum_length=2000) 
alter table tablename 
alter column columnname nvarchar(500);  
GO
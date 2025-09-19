-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/10/09 【时间】
-- 【内容简单介绍】 --樊志君
begin
-- 去掉FRAME_MYADDRESSBOOK 表的OBJECTTYPE字段默认值; 
-- 去掉fframe_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
-- 修改frame_secretlevel_snapshot主键为rowguid
-- 由于表名长度限制，将部分快照表名字重命名
-- frame_accountrelation_snapshot重命名为frame_ar_snapshot
-- frame_myaddressbook_snapshot重命名为frame_mybook_snapshot
-- frame_myaddressgroup_snapshot重命名frame_mygroup_snapshot
-- frame_secretlevel_snapshot重命名frame_seclevel_snapshot
-- 添加appcode字段 
DECLARE @primaryKey varchar(50);
DECLARE @isexist  int;
DECLARE @conName  varchar(50);
DECLARE @conName1  varchar(50);
SELECT @isexist=count(*) FROM sysobjects WHERE id = ( SELECT syscolumns.cdefault FROM sysobjects 
    INNER JOIN syscolumns ON sysobjects.Id=syscolumns.Id 
    WHERE sysobjects.name='Frame_MyAddressBook' AND syscolumns.name='ObjectType');

if(@isexist>0)
begin
	SELECT @conName=name FROM sysobjects WHERE id = ( SELECT syscolumns.cdefault FROM sysobjects 
    INNER JOIN syscolumns ON sysobjects.Id=syscolumns.Id 
    WHERE sysobjects.name='Frame_MyAddressBook' AND syscolumns.name='ObjectType');
	EXEC ('alter table Frame_MyAddressBook drop constraint ' + @conName);
end;

-- 去掉fframe_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
SELECT @isexist=count(*) FROM sysobjects WHERE id = ( SELECT syscolumns.cdefault FROM sysobjects 
    INNER JOIN syscolumns ON sysobjects.Id=syscolumns.Id 
    WHERE sysobjects.name='frame_myaddressbook_snapshot' AND syscolumns.name='ObjectType');

if(@isexist>0)
begin
	SELECT @conName1=name FROM sysobjects WHERE id = ( SELECT syscolumns.cdefault FROM sysobjects 
    INNER JOIN syscolumns ON sysobjects.Id=syscolumns.Id 
    WHERE sysobjects.name='frame_myaddressbook_snapshot' AND syscolumns.name='ObjectType');
	EXEC ('alter table frame_myaddressbook_snapshot drop constraint ' + @conName1);
end;

select  @isexist=count(*)  from  dbo.sysobjects where name=  'frame_accountrelation_snapshot';
if(@isexist>0)
exec sp_rename 'frame_accountrelation_snapshot','frame_ar_snapshot';

select  @isexist=count(*)  from  dbo.sysobjects where name=  'frame_myaddressbook_snapshot';
if(@isexist>0)
exec sp_rename 'frame_myaddressbook_snapshot','frame_mybook_snapshot';

select  @isexist=count(*)  from  dbo.sysobjects where name=  'frame_myaddressgroup_snapshot';
if(@isexist>0)
exec sp_rename 'frame_myaddressgroup_snapshot','frame_mygroup_snapshot';
 
select  @isexist=count(*)  from  dbo.sysobjects where name=  'frame_secretlevel_snapshot';
if(@isexist>0)
exec sp_rename 'frame_secretlevel_snapshot','frame_seclevel_snapshot';


select @isexist=count(*) from INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE
WHERE CONSTRAINT_NAME=(select CONSTRAINT_NAME from INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE CONSTRAINT_TYPE='PRIMARY KEY' AND TABLE_NAME='frame_seclevel_snapshot') and lower(column_name)='rowguid';

if(@isexist=0) 
begin
  select @primaryKey=CONSTRAINT_NAME from INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE
WHERE CONSTRAINT_NAME=(select CONSTRAINT_NAME from INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE CONSTRAINT_TYPE='PRIMARY KEY' AND TABLE_NAME='frame_seclevel_snapshot') and lower(column_name)!='rowguid';
EXEC ('alter table frame_seclevel_snapshot drop constraint ' + @primaryKey);
alter table frame_seclevel_snapshot add primary key (rowguid);
end;

end;
GO
-- 添加appcode字段
if not exists (select name from syscolumns  where id = object_id('app_info') and name='appcode' ) 
alter table app_info add appcode  nvarchar(50); 
GO
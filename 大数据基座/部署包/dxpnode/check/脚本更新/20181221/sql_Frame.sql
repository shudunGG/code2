-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/12/21

if not exists (select * from information_schema.columns  where  table_name = 'app_info' and column_name='allowDistrictCodeId' and data_type='nvarchar' and character_maximum_length=50) 
alter table app_info 
alter column allowDistrictCodeId nvarchar(50);  
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='linkmanphone' ) 
alter table app_info add linkmanphone  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='linkmanname' ) 
alter table app_info add linkmanname  nvarchar(100); 
GO

if not exists (select name from syscolumns  where id = object_id('comm_feedback_detail_info') and name='processversioninstanceguid' ) 
alter table comm_feedback_detail_info add processversioninstanceguid varchar(100);
GO

if not exists (select name from syscolumns  where id = object_id('comm_feedback_detail_info') and name='workitemguid' ) 
alter table comm_feedback_detail_info add workitemguid varchar(100);
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/07/27
-- epointsform_tablerelation表添加时间戳字段timestamp
if not exists (select * from information_schema.columns  where  table_name = 'epointsform_tablerelation' and column_name='timestampinfo') 
alter table epointsform_tablerelation add timestampinfo nvarchar(100); 
GO



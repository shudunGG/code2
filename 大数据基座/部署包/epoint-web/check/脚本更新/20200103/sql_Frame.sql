-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/2/6 补充
-- 修改APPROOTURL字段长度示例
-- app_info表的字符集utf8mb4，限制了总表的varchar字段的总长度，导致appsecret的长度无法被修改。
if not exists (select * from information_schema.columns  where  table_name = 'app_info' and column_name='APPROOTURL' and data_type='nvarchar' and character_maximum_length=500) 
alter table app_info 
alter column APPROOTURL nvarchar(500);  
GO

-- 2020/01/03 
-- 修改appsecret字段长度示例
if not exists (select * from information_schema.columns  where  table_name = 'app_info' and column_name='appsecret' and data_type='nvarchar' and character_maximum_length=500) 
alter table app_info 
alter column appsecret nvarchar(500);  
GO
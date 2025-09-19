-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/09/22【时间】
 
-- api_channel_upstream字段upstream_encode_name改为1500长度 --cdy
if not exists (select * from information_schema.columns  where table_name ='api_channel_upstream' and column_name='upstream_encode_name' and character_maximum_length=1500) 
alter table api_channel_upstream add upstream_encode_name nvarchar(1500);  
else
alter table api_channel_upstream 
alter column upstream_encode_name nvarchar(1500);  
GO

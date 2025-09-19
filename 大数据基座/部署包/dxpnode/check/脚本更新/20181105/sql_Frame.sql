-- 所有脚本可直接复制到sql server查询设计器中执行

-- 修改sso_token_info 表的字段名称--俞俊男

if  exists (select * from information_schema.columns  where  table_name = 'sso_token_info' and column_name='type') 
exec sp_rename 'sso_token_info.type','tokentype';
GO

-- 修改frame_ou_weixin 表的字段名称--周志豪

if  exists (select * from information_schema.columns  where  table_name = 'frame_ou_weixin' and column_name='id') 
exec sp_rename 'frame_ou_weixin.id','rowguid';
GO
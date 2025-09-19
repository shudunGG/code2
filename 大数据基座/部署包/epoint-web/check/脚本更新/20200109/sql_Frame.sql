-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/01/09
-- 角色信息增加appguid字段 --何晓瑜
if not exists (select * from information_schema.columns where  table_name = 'frame_role' and column_name = 'appguid' ) 
alter table frame_role add appguid varchar(50); 
GO
if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'appguid' ) 
alter table frame_role_snapshot add appguid varchar(50); 
GO
if not exists (select * from information_schema.columns where  table_name = 'frame_roletype' and column_name = 'appguid' ) 
alter table frame_roletype add appguid varchar(50); 
GO
if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'appguid' ) 
alter table frame_roletype_snapshot add appguid varchar(50); 
GO

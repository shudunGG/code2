-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/25 
-- 修改isrestjsboot字段类型

if exists (select * from information_schema.columns  where  table_name = 'frame_config' and column_name='isrestjsboot' and data_type='nvarchar' ) 
update frame_config set isrestjsboot='0' where isrestjsboot='false';
update frame_config set isrestjsboot='1' where isrestjsboot='true';
alter table frame_config 
alter column isrestjsboot int; 
GO

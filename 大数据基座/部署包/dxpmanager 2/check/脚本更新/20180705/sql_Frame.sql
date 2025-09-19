-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/07/05
-- 去除frame_user中ouguid字段的空格--王颜
if exists (select * from frame_user where OUGUID like '% %') 
    update  frame_user set OUGUID = lTRIM(RTRIM(OUGUID));
GO


-- 数据源表放大servername长度--王露
if not exists (select * from information_schema.columns  where  table_name = 'DataSource' and column_name='servername' and data_type='nvarchar' and character_maximum_length=500) 
alter table DataSource alter column servername nvarchar(500); 
GO
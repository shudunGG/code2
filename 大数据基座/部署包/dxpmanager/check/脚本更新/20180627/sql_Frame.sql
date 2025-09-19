-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/06/27
-- exun_message字段长度增加 --【王颜】

if not exists (select * from information_schema.columns  where  table_name = 'exun_message' and column_name='touserdisplayname' and data_type='varchar' and character_maximum_length=2000) 
alter table exun_message 
alter column touserdisplayname varchar(2000);  
GO
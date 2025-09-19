-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/21

if not exists (select name from syscolumns  where id = object_id('frame_anti_tamper') and name='datasourceconfig' ) 
alter table frame_anti_tamper add datasourceconfig varchar(200);
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/26【时间】
-- frame_lessee表新增datasourceGuid字段长度-- 孟佳佳
if not exists (select name from syscolumns  where id = object_id('frame_lessee') and name='datasourceGuid' ) 
alter table frame_lessee add datasourceGuid nvarchar(50); 
GO
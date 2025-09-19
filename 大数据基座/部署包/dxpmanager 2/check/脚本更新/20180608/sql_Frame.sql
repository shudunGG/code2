-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/6/8 
-- 系统参数添加字段isrestjsboot --周志豪

if not exists (select name from syscolumns  where id = object_id('frame_config') and name='isrestjsboot' ) 
alter table frame_config add isrestjsboot  nvarchar(50); 
GO


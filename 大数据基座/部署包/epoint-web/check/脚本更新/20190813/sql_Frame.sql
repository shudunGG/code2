-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/08/13
-- datasource数据源表添加conntype字段 --孟佳佳
if not exists (select name from syscolumns  where id = object_id('datasource') and name='conntype' ) 
 alter table datasource add conntype nvarchar(10);
GO




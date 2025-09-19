-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/03/23

-- 基础信息表添加表控件英文字段创建方式字段，manual手动，其余是自动  --季立霞
if not exists (select name from syscolumns  where id = object_id('epointsform_table_basicinfo') and name='ctrlencreatetype' ) 
alter table epointsform_table_basicinfo add ctrlencreatetype  varchar(12); 
GO





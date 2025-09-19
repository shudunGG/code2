-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/25

-- 添加图标背景颜色字段 --施佳炜
if not exists (select name from syscolumns  where id = object_id('messages_type') and name='iconbgcolor' ) 
alter table messages_type add iconbgcolor nvarchar(50); 
GO

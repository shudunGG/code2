-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/09/01
-- frame_attachinfo表添加附件类型webcontenttype

if not exists (select * from information_schema.columns  where  table_name = 'frame_attachinfo' and column_name='webcontenttype') 
alter table frame_attachinfo add webcontenttype nvarchar(150); 
GO


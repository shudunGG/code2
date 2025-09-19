-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2021/07/20
-- 表frame_role新增字段roledescription 
if not exists (select name from syscolumns  where id = object_id('frame_role') and name='roledescription' ) 
alter table frame_role add roledescription  nvarchar(100); 
GOr table frame_ou_snapshot add oucodefull nvarchar(100); 
GO
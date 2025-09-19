-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/29 【时间】
-- 门户模板表新增所属门户字段 --【俞俊男】


-- 门户模板表新增所属门户字段
if not exists (select name from syscolumns  where id = object_id('frame_portal_template') and name='belongportalguid' ) 
alter table frame_portal_template add belongportalguid  nvarchar(50); 
GO

-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/24 【时间】
-- -- EpointsformListVersion（列表版本表）添加字段formguid -- 薛炳

-- EpointsformListVersion（列表版本表）添加字段formguid
if not exists (select name from syscolumns  where id = object_id('EpointsformListVersion') and name='formguid' ) 
alter table EpointsformListVersion add formguid  nvarchar(50); 
GO

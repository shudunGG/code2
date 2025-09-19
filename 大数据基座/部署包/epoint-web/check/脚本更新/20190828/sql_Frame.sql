-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/08/28【时间】
-- api_info表删除字段timeoutInMilliseconds --【俞俊男】

-- 删除字段timeoutInMilliseconds
if exists (select name from syscolumns  where id = object_id('api_info') and name='timeoutInMilliseconds' ) 
alter table api_info drop column timeoutInMilliseconds;
GO

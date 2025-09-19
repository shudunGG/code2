-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/7/11
-- sso_token_info添加platform，用于鉴别是否是移动端 --【wy】

if not exists (select name from syscolumns  where id = object_id('sso_token_info') and name='platform' ) 
alter table sso_token_info add platform  nvarchar(50); 
GO

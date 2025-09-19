-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/4/10
-- 手势密码和生物识别锁定功能添加字段 --王颜
if not exists (select name from syscolumns  where id = object_id('frame_user') and name='gesturepassword' ) 
alter table frame_user add gesturepassword nvarchar(500); 
GO

if not exists (select name from syscolumns  where id = object_id('mobile_user') and name='gesturepassword' ) 
alter table mobile_user add gesturepassword nvarchar(500); 
GO

-- 非织语环境禁止重复登录功能添加字段标记已被踢出 --王颜
if not exists (select name from syscolumns  where id = object_id('sso_token_info') and name='mobilekickout' ) 
alter table sso_token_info add mobilekickout int; 
GO
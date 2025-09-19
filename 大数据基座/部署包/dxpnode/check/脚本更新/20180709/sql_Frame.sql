-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/07/09 【时间】
-- frame_login_log添加appkey字段 -- 周志豪

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('frame_login_log') and name='appkey' ) 
alter table frame_login_log add appkey  nvarchar(50); 
GO

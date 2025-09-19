-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/10/10 【时间】

-- 个人消息规则表增加字段 --何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_personalrule') and name='isvalid' ) 
alter table messages_personalrule add isvalid int; 
GO
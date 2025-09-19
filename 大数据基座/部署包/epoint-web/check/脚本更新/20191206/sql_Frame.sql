-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/06 
-- 消息渠道表增加渠道mq监听数量的配置 --【何晓瑜】

if not exists (select name from syscolumns  where id = object_id('messages_channel') and name='concurrency' ) 
alter table messages_channel add concurrency  int; 
GO


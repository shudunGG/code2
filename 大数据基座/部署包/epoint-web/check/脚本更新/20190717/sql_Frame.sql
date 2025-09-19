-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/16【时间】
-- frame_config表增加manageindependent-- 何晓瑜
-- messages_channel表增加extendattr,extendconfigpage字段 -- 何晓瑜
-- messages_message和messages_messagehistory表增加mobilelinkurl字段 -- 何晓瑜

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('frame_config') and name='manageindependent' ) 
alter table frame_config add manageindependent int default 0; 
GO
if not exists (select name from syscolumns  where id = object_id('messages_channel') and name='extendattr' ) 
alter table messages_channel add extendattr varchar(2000); 
GO
if not exists (select name from syscolumns  where id = object_id('messages_channel') and name='extendconfigpage' ) 
alter table messages_channel add extendconfigpage varchar(500); 
GO
if not exists (select name from syscolumns  where id = object_id('messages_message') and name='mobilelinkurl' ) 
alter table messages_message add mobilelinkurl varchar(1000); 
GO
if not exists (select name from syscolumns  where id = object_id('messages_messagehistory') and name='mobilelinkurl' ) 
alter table messages_messagehistory add mobilelinkurl varchar(1000); 
GO

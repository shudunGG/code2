-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/06/29
-- messages_waitsend增加字段,解决带发表消息无法收回的问题--何晓瑜
if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier') 
alter table messages_waitsend add clientidentifier  nvarchar(200); 
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier2') 
alter table messages_waitsend add clientidentifier2 nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier3') 
alter table messages_waitsend add clientidentifier3 nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier4') 
alter table messages_waitsend add clientidentifier4 nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier5') 
alter table messages_waitsend add clientidentifier5 nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='clientidentifier6' ) 
alter table messages_waitsend add clientidentifier6 nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='appkey' ) 
alter table messages_waitsend add appkey nvarchar(200);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='typeguid' ) 
alter table messages_waitsend add typeguid nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='targetuserid' ) 
alter table messages_waitsend add targetuserid nvarchar(50);
GO


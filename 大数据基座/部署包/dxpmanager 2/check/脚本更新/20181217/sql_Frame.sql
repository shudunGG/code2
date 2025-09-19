-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/21
if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='messagesmessageguid' ) 
alter table messages_waitsend add messagesmessageguid varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='channelguid' ) 
alter table messages_waitsend add channelguid varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('messages_waitsend') and name='waitsendtype' ) 
alter table messages_waitsend add waitsendtype varchar(50);
GO
if not exists (select name from syscolumns  where id = object_id('messages_log') and name='messagesmessageguid' ) 
alter table messages_log add messagesmessageguid varchar(50);
GO
-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
-- select count(*) from information_schema.columns where  table_name = '...' and column_name = '...'

select count(*) from syscolumns  where id = object_id('messages_waitsend') and name='targetuserid'
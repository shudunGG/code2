-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select case when count=1 then 0 else 1 end from (select count(*) as count from information_schema.views where table_schema = database() and table_name='view_appmanage_myelement')n


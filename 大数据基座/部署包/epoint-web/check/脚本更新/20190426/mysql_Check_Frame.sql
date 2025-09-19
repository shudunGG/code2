-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select count(*) from  (SELECT * FROM information_schema. COLUMNS where table_schema = DATABASE () AND table_name ='TABLE_BASICINFO' ) as n where  n.column_name='TABLEID'  and n.EXTRA=' '


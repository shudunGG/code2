-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select count(*) from information_schema.statistics where table_schema= (select DATABASE()) and table_name like 'frame_userrole_snapshot%' and index_name like 'uq_frame_ur_snapshot_%' and COLUMN_NAME = 'ouguid'

-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
SELECT count(*) FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'frame_userrole_snapshot' AND column_name = 'row_id' AND IS_NULLABLE = 'yes'

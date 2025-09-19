-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
-- select count(*) from  user_tab_columns where table_name = upper('...') and column_name = upper('...')
select count(*)  from user_indexes WHERE TABLE_NAME=upper('frame_userrolerelation') and index_name=upper('uq_frame_userrolerelation') and uniqueness=upper('UNIQUE')
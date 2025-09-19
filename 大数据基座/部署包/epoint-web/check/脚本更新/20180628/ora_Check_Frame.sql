-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
-- select count(*) from  user_tab_columns where table_name = upper('...') and column_name = upper('...')
select count(*) from user_tab_columns where table_name = upper('frame_quicklink_user') and column_name = upper('LINKURL')  and data_type='NVARCHAR2' and data_length='1000'
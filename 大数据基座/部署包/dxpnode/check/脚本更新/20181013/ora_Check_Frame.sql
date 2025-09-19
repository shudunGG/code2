-- 检测frame_user ,frame_user_snapshot的md5id字段是否已经更新
select count(*) from  user_tab_columns where table_name = upper('frame_user') and column_name = upper('MD5ID')
--select count(*) from  user_tab_columns where table_name = upper('frame_user_snapshot') and column_name = upper('MD5ID')
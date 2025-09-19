-- 检测frame_user ,frame_user_snapshot的issyncthirdparty字段是否已经更新
select count(*) from  user_tab_columns where table_name = upper('frame_userrole_snapshot') and column_name = upper('row_id') and nullable = upper('Y')

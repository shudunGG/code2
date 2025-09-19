-- 检测frame_portal的opentype字段是否已经更新
select count(*) from  user_tab_columns where table_name = upper('frame_portal') and column_name = upper('opentype')
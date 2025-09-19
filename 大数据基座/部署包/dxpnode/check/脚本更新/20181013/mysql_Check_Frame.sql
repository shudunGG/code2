-- 检测frame_user ,frame_user_snapshot的MD5ID字段是否已经更新
select count(*) from information_schema.columns where table_schema = database()  and table_name = 'frame_user_snapshot' and column_name = 'MD5ID'

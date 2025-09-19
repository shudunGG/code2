-- 检测frame_user ,frame_user_snapshot的md5id字段是否已经更新
select count(*) from information_schema.columns where  table_name = 'frame_user' and column_name = 'MD5ID'
--select count(*) from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'MD5ID'
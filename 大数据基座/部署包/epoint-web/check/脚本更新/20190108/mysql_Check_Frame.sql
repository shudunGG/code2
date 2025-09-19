-- frame_portal ,opentype
select count(*) from information_schema.columns where table_schema = database()  and table_name = 'frame_portal' and column_name = 'opentype'

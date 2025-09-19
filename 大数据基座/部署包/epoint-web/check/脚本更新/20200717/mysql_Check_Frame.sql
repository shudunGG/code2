select count(*) from information_schema.columns where table_schema = database() and table_name = 'frame_privacy' and column_name = 'privacyType'

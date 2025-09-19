select count(*) from information_schema.columns where table_schema = database() and table_name = 'Frame_UserRole_snapshot' and column_name = 'ouguid'

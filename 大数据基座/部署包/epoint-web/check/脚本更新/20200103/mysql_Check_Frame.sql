select count(*) from information_schema.columns where table_schema = database() and table_name = 'app_info' and column_name = 'appsecret' and data_type = 'varchar' and character_maximum_length=500

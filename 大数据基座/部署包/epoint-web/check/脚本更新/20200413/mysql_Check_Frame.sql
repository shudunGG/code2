select count(*) from information_schema.columns where table_schema = database() and table_name = 'messages_center' and column_name = 'tagname'

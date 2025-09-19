select count(*) from  user_tab_columns where table_name = upper('exun_message') and column_name = upper('CONTENT') and data_type=upper('nclob')

select count(*) from  user_tab_columns where table_name = upper('DataSource') and column_name = upper('servername') and data_type='NVARCHAR2' and data_length='1000'

select count(*) as count from  user_tab_columns where table_name = upper('datasource') and column_name = upper('conntype') and data_type='NVARCHAR2' and data_length='20'


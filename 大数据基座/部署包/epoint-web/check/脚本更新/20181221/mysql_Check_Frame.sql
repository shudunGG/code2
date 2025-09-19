select count(*) from information_schema.columns where table_schema = database()  and table_name = 'comm_feedback_detail_info' and column_name = 'workitemguid'

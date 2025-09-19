-- 检测frame_user的row_id字段是否为空
select count(*) from information_schema.columns where table_schema = database()  and table_name = 'frame_user' and column_name = 'row_id' and data_type='int' and IS_NULLABLE ='YES'

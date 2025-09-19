-- 检测api_info的urlpattern字段是否为空
select count(*) from information_schema.columns where table_schema = database()  and table_name = 'api_info' and column_name = 'urlpattern' and data_type='varchar' and IS_NULLABLE ='YES'

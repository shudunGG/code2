-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select count(*) from information_schema.columns where table_schema = database() and table_name = 'api_channel_upstream' and column_name = 'upstream_encode_name' and character_maximum_length=1500

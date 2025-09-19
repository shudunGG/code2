-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select count(*) from (select count(*) as c from information_schema.columns where table_schema = database() and table_name = 'api_info' and column_name = 'timeoutInMilliseconds') as t WHERE t.c = 0

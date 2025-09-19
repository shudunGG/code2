select case when count=1 then 0 else 1 end from (select count(*) as count from information_schema.columns  where  table_name = 'appmanage_publicelement' and column_name='AllowMoreButton')n


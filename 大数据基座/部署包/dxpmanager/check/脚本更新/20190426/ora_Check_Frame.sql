select case when count=1 then 0 else 1 end from ( select count from( select count(*)as count  from user_triggers where trigger_name=upper('TG_TABLE_BASICINFO'))n)m

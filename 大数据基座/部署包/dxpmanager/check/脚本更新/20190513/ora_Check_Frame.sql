
select case when count=1 then 0 else 1 end from ( select count(*) as count from  user_tab_columns where table_name = upper('appmanage_publicelement') and column_name = upper('AllowMoreButton'))n


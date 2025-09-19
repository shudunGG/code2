--此脚本为样例
select case count(1) when 0 then 0 else 1 end from information_schema.TABLES where TABLE_NAME = 'epoint_job_manager_config' and table_schema =database();
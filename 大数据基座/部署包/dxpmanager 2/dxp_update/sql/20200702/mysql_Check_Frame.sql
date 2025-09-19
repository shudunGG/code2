--此脚本为样例
select case count(1) when 0 then 0 else 1 end from information_schema.COLUMNS where TABLE_NAME = 'dxp_flow_info' and COLUMN_NAME = 'hivedsid' and table_schema =database();
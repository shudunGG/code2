--此脚本为样例
select count(*) from user_tab_columns where UPPER(table_name) = 'DXP_MODEL_FLOW_INFO' and UPPER(column_name)='ISUSE';
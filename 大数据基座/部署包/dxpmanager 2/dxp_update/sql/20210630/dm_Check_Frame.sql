--此脚本为样例
select count(*) from user_tab_columns where UPPER(table_name) = 'DXP_MODEL_SPECIAL_SUBASSEMBLY_PARAMETER' and UPPER(column_name)='ORDERNUM';
-- -- 如果personal_portal_element没有rowguid,删表重构---何晓瑜
select count(*) from  user_tab_columns where table_name = upper('personal_portal_element') and column_name = upper('rowguid')
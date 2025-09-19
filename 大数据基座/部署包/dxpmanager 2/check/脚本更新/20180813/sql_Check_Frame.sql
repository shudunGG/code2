-- -- 如果personal_portal_element没有rowguid,删表重构---何晓瑜
select count(*) from information_schema.columns where  table_name = 'personal_portal_element' and column_name = 'rowguid'
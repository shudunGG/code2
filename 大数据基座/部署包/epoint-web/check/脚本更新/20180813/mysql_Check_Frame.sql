-- 如果personal_portal_element没有rowguid,那直接删表重建(老的表根本用不起来,没啥数据)
select count(*) from information_schema.columns where table_schema = database() and table_name = 'personal_portal_element' and column_name = 'rowguid'

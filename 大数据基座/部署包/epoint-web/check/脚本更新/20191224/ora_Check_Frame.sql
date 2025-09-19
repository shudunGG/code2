-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
select count(*) from  user_tab_columns where table_name = upper('epointsform_fieldrelation') and column_name = upper('sharefieldcname')
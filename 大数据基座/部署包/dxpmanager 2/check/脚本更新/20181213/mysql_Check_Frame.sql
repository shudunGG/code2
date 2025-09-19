-- 检测frame_user ,frame_user_snapshot的issyncthirdparty字段是否已经更新
select count(*) from information_schema.columns where table_schema = database()  and table_name = 'frame_anti_tamper' and column_name = 'datasourceconfig'

-- 检测frame_user ,frame_user_snapshot的issyncthirdparty字段是否已经更新
select count(*) from information_schema.columns where  table_name = 'comm_feedback_detail_info' and column_name = 'workitemguid'
select count(*) from information_schema.columns where table_schema = database() and table_name = 'api_runtime_alert_info'

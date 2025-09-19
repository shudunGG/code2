select count(*) from information_schema.columns where table_schema = database() and table_name = 'workflow_activity' and column_name = 'isallowattachwrite'

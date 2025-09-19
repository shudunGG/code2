select count(*) from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'userroleguid' and data_type='nvarchar' and character_maximum_length=50

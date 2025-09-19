select count(*) from user_constraints t where t.table_name = upper('FRAME_OU_SNAPSHOT') and t.constraint_name=upper('UQ_FRAME_OU_SNAPSHOT') and t.constraint_type='U'

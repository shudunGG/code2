select count(1) from user_tab_columns where table_name = upper('Workflow_PVI_Material') and column_name = upper('clienttag') and data_type='NVARCHAR2' and data_length='4000'
  
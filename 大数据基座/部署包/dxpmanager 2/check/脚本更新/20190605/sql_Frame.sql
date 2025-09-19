if not exists (select * from information_schema.columns  where  table_name = 'Workflow_PVI_Material' and column_name='clienttag' and data_type='nvarchar' and character_maximum_length=2000) 
alter table Workflow_PVI_Material 
alter column clienttag nvarchar(2000);  
GO
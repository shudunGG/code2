if not exists (select * from information_schema.columns  where  table_name = 'code_items' and column_name='itemtext' and data_type='nvarchar' and character_maximum_length=2000) 
alter table code_items 
alter column itemtext nvarchar(2000);  
GO
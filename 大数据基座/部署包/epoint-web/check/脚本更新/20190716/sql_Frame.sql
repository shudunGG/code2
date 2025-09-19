-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/7/16
-- comm_feedback_question_info新增字段platform--wy
if not exists (select name from syscolumns  where id = object_id('comm_feedback_question_info') and name='platform' ) 
alter table comm_feedback_question_info add platform int; 
GO

-- 修改字段示例
if not exists (select * from information_schema.columns  where  table_name = 'app_param' and column_name='paramvalue' and data_type='nvarchar' and character_maximum_length=2000) 
alter table app_param 
alter column paramvalue nvarchar(2000);  
GO
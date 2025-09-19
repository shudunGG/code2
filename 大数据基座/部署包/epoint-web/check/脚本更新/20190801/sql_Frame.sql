-- 所有脚本可直接复制到sql server查询设计器中执行

-- 删除表api_runtime_alert_rule字段 --【陈端一】
if  exists (select * from information_schema.columns  where  table_name = 'api_runtime_alert_rule' and column_name='type') 
alter table api_runtime_alert_rule drop column type;  
GO

-- FRAME_COMMISSIONSET_HANDLE 增加title字段 --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'FRAME_COMMISSIONSET_HANDLE' and column_name='title') 
alter table FRAME_COMMISSIONSET_HANDLE add title nvarchar(200); 
GO



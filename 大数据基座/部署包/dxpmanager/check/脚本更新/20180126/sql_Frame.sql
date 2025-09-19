-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2018/01/26
-- 修改api_sync_log中description字段长度--施佳炜
if not exists (select * from information_schema.columns where  table_name = 'api_sync_log' and column_name = 'description' and data_type='text') 
alter table api_sync_log 
alter column description text; 
GO

-- 修改表messages_waitsend中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_waitsend' and column_name = 'waitsendtime' and data_type='datetime') 
alter table messages_waitsend 
alter column waitsendtime datetime; 
GO

-- 修改表messages_user中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_user' and column_name = 'adddate' and data_type='datetime') 
alter table messages_user 
alter column adddate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_user' and column_name = 'lastupdate' and data_type='datetime') 
alter table messages_user 
alter column lastupdate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_user' and column_name = 'lastupdatetime' and data_type='datetime') 
alter table messages_user 
alter column lastupdatetime datetime; 
GO

-- 修改表messages_messagehistory中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_messagehistory' and column_name = 'sendtime' and data_type='datetime') 
alter table messages_messagehistory 
alter column sendtime datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_messagehistory' and column_name = 'readtime' and data_type='datetime') 
alter table messages_messagehistory 
alter column readtime datetime; 
GO

-- 修改表messages_message中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_message' and column_name = 'sendtime' and data_type='datetime') 
alter table messages_message 
alter column sendtime datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_message' and column_name = 'readtime' and data_type='datetime') 
alter table messages_message 
alter column readtime datetime; 
GO

-- 修改表messages_log中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_log' and column_name = 'sendtime' and data_type='datetime') 
alter table messages_log 
alter column sendtime datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_log' and column_name = 'waitsendtime' and data_type='datetime') 
alter table messages_log 
alter column waitsendtime datetime; 
GO

-- 修改表messages_center中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_center' and column_name = 'overtimepoint' and data_type='datetime') 
alter table messages_center 
alter column overtimepoint datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center' and column_name = 'earlywarningpoint' and data_type='datetime') 
alter table messages_center 
alter column earlywarningpoint datetime; 
GO

-- 修改表messages_center_histroy中的字段的长度，把date全部修改为datetime--王颜
if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'generatedate' and data_type='datetime') 
alter table messages_center_histroy 
alter column generatedate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'schedulesenddate' and data_type='datetime') 
alter table messages_center_histroy 
alter column schedulesenddate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'senddate' and data_type='datetime') 
alter table messages_center_histroy 
alter column senddate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'readdate' and data_type='datetime') 
alter table messages_center_histroy 
alter column readdate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'donedate' and data_type='datetime') 
alter table messages_center_histroy 
alter column donedate datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'overtimepoint' and data_type='datetime') 
alter table messages_center_histroy 
alter column overtimepoint datetime; 
GO

if not exists (select * from information_schema.columns where  table_name = 'messages_center_histroy' and column_name = 'earlywarningpoint' and data_type='datetime') 
alter table messages_center_histroy 
alter column earlywarningpoint datetime; 
GO



-- 修改快照表frame_ou_e_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'ouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column ouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'oufax' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column oufax nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'oucertguid' data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column oucertguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'oucertname' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column oucertname nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_e_snapshot' and column_name = 'tenantguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_e_snapshot 
alter column tenantguid nvarchar(50); 
GO

-- 修改快照表frame_ou_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'ouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column ouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'oucode' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column oucode nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'ouname' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column ouname nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'oushortname' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column oushortname nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'description' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column description nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'address' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column address nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'postalcode' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column postalcode nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'tel' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column tel nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'baseouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column baseouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'parentouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column parentouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'testvarchar' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column testvarchar nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_ou_snapshot' and column_name = 'tenantguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_ou_snapshot 
alter column tenantguid nvarchar(50); 
GO

-- 修改快照表frame_role_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'roleguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column roleguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'rolename' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column rolename nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'belongouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column belongouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'roletype' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column roletype nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_role_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_role_snapshot 
alter column clientip nvarchar(50); 
GO

-- 修改快照表frame_roletype_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'roletypeguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column roletypeguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'roletypename' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column roletypename nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'belongbaseouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column belongbaseouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_roletype_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_roletype_snapshot 
alter column clientip nvarchar(50); 
GO

-- 修改快照表frame_secondou_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'userguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_secondou_snapshot 
alter column userguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'ouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_secondou_snapshot 
alter column ouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_secondou_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_secondou_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_secondou_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_secondou_snapshot 
alter column rowguid nvarchar(50); 
GO

-- 修改快照表frame_user_e_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_user_e_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_e_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_e_snapshot' and column_name = 'tenantguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_e_snapshot 
alter column tenantguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_e_snapshot' and column_name = 'carnum' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_e_snapshot 
alter column carnum nvarchar(50); 
GO

-- 修改快照表frame_user_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'userguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column userguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'loginid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column loginid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'password' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column password nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'ouguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column ouguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'displayname' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column displayname nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'leaderguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column leaderguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'telephoneoffice' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column telephoneoffice nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'mobile' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column mobile nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'telephonehome' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column telephonehome nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'fax' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column fax nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'sex' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column sex nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'adloginid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column adloginid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_user_snapshot' and column_name = 'tenantguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_user_snapshot 
alter column tenantguid nvarchar(50); 
GO

-- 修改快照表frame_userrole_snapshot中的字段的长度，把nvarchar(25)全部修改为nvarchar(50)--王颜
if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'userguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column userguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'roleguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column roleguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'appkey' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column appkey nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'rowguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column rowguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'clientip' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column clientip nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'tenantguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column tenantguid nvarchar(50); 
GO

if not exists (select * from information_schema.columns where  table_name = 'frame_userrole_snapshot' and column_name = 'userroleguid' and data_type='nvarchar' and character_maximum_length=50) 
alter table frame_userrole_snapshot 
alter column userroleguid nvarchar(50); 
GO

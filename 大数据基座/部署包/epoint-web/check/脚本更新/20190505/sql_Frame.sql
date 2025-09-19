-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/05【时间】
-- api_info表添加字段wsNameSpace、wsSoapAction、wsWsdlContent --【俞俊男】


-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('api_info') and name='wsNameSpace' ) 
alter table api_info add wsNameSpace  nvarchar(100); 
GO


-- api_request_params表中添加position -- 王颜
if not exists (select name from syscolumns  where id = object_id('api_request_params') and name='position' ) 
alter table api_request_params add position  nvarchar(200); 
GO

-- 添加字段operatetype
if not exists (select name from syscolumns  where id = object_id('api_info') and name='wsSoapAction' ) 
alter table api_info add wsSoapAction  nvarchar(100); 
GO

-- 添加字段wsWsdlContent
if not exists (select name from syscolumns  where id = object_id('api_info') and name='wsWsdlContent' ) 
alter table api_info add wsWsdlContent  text; 
GO
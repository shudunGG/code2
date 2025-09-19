-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/06/06 【时间】
-- 【扩展控件管理表新增描述字段】 --【薛炳】

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('EpointsformExtensibleControl') and name='TableType' ) 
alter table EpointsformExtensibleControl add TableType  int; 
GO

--  epointsform中formid自增 --薛炳
IF  not  EXISTS  (       
select  colstat  from  syscolumns  where  id=object_id('epointsform')  and  name  ='formId'  and  colstat  =  1   
)   
alter  table  epointsform  add  formId  int  identity(1,1);

-- epointsformtablelist  表添加baseouguid --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointsformtablelist' and column_name='baseouguid') 
alter table epointsformtablelist add baseouguid nvarchar(50); 
GO

-- epointsformlistversion表添加baseouguid --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointsformlistversion' and column_name='baseouguid') 
alter table epointsformlistversion add baseouguid nvarchar(50); 
GO

-- epointformversion表添加baseouguid --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointformversion' and column_name='baseouguid') 
alter table epointformversion add baseouguid nvarchar(50); 
GO

-- epointsform表添加baseouguid --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointsform' and column_name='baseouguid') 
alter table epointsform add baseouguid nvarchar(50); 
GO

-- epointsformlistversion表添加status --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointsformlistversion' and column_name='status') 
alter table epointsformlistversion add status nvarchar(50); 
GO

-- epointformversion表添加表添加status --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointformversion' and column_name='status') 
alter table epointformversion add status nvarchar(50); 
GO

-- epointsformtablelist表添加listtype --薛炳
if not exists (select * from information_schema.columns  where  table_name = 'epointsformtablelist' and column_name='listtype') 
alter table epointsformtablelist add listtype nvarchar(50); 
GO

-- epointsformtablelist中listid自增 --季立霞
IF  not  EXISTS  (       
select  colstat  from  syscolumns  where  id=object_id('epointsformtablelist')  and  name  ='listid'  and  colstat  =  1   
)   
alter  table  epointsformtablelist  add  listid  int  identity(1,1);

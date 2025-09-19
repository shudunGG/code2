-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/13 
-- 表单版本表中增加复制数量字段 --【薛炳】

if not exists (select name from syscolumns  where id = object_id('epointformversion') and name='copynum' ) 
alter table epointformversion add copynum  int; 
GO

if not exists (select name from syscolumns  where id = object_id('TableList_SearchAreaConfig') and name='customcode' ) 
alter table TableList_SearchAreaConfig add customcode  nvarchar(50); 
GO




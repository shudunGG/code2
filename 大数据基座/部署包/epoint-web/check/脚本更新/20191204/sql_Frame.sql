-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/03 
-- 在线表单tablebasicinfo表新增1个字段、tablestruct表新增4个字段 --【季立霞】

-- 表单基础信息表添加合并表单ids字段
if not exists (select name from syscolumns  where id = object_id('epointsform_table_basicinfo') and name='mergeformids' ) 
alter table epointsform_table_basicinfo add mergeformids  nvarchar(100); 
GO

-- 添加手风琴代码项字段
if not exists (select name from syscolumns  where id = object_id('epointsform_table_struct') and name='codeid' ) 
alter table epointsform_table_struct add codeid  int; 
GO

-- 添加所属栏目Id字段
if not exists (select name from syscolumns  where id = object_id('epointsform_table_struct') and name='itemid' ) 
alter table epointsform_table_struct add itemid  int; 
GO

-- 添加所属栏目中顺序字段
if not exists (select name from syscolumns  where id = object_id('epointsform_table_struct') and name='columnordernum' ) 
alter table epointsform_table_struct add columnordernum  int; 
GO

-- 添加合并前字段所属表字段
if not exists (select name from syscolumns  where id = object_id('epointsform_table_struct') and name='beforetableid' ) 
alter table epointsform_table_struct add beforetableid  int; 
GO


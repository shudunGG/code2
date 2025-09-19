-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/04【时间】
-- 添加表epointformversion --【薛炳】


-- 表epointformversion添加字段htmlData


if not exists (select name from syscolumns  where id = object_id('epointformversion') and name='htmlData' ) 
alter table epointformversion add htmlData TEXT; 
GO

 
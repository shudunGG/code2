-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/5/23 【时间】
-- 【excel导入历史查询】 --【严璐琛】

-- 添加字段示例 
if not exists (select * from dbo.sysobjects where id = object_id('excel_import_history'))
create table excel_import_history
(   
   belongxiaqucode nvarchar(50) null,
   operateusername nvarchar(50) null,
   operatedate datetime null,
   row_id numeric(22,0) null,
   yearflag nvarchar(4) null,
   rowguid nvarchar(50) not null primary key,
   importuserguid nvarchar(50) null,
   attachguid nvarchar(50) null,
   attachmd5 nvarchar(50) null,
   importresult nvarchar(500) null,
   importdetail text null
);
GO

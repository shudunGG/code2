-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/05/17 【时间】
-- 【新增经办表，相关参数表新增描述字段】 --【季海英】

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('workflow_handle_info'))
create table  workflow_handle_info(
            handleguid 	nvarchar(100) not null primary key,
            processguid 	nvarchar(100) null,
            processversionguid 	nvarchar(100) null,
            pviguid 	nvarchar(100) null,
            misrowguid 	nvarchar(100) null,
            tableid 	int null,
            userguid 	nvarchar(100) null,
            ouguid 	nvarchar(100) null,
            baseouguid 	nvarchar(100) null,
            lasthandletime 	datetime null,
            status 	nvarchar(100) null,
            isdone 	int null,
            note 	nvarchar(100) null
);
GO



-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('workflow_method_parameter') and name='mpnamedescription' ) 
alter table workflow_method_parameter add mpnamedescription  nvarchar(100); 
GO
-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('workflow_method_parameter') and name='mpvaluedescription' ) 
alter table workflow_method_parameter add mpvaluedescription  nvarchar(100); 
GO

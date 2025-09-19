-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/5/15 
-- 季立霞

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('workflow_template'))
create table workflow_template
   (
      templateguid         nvarchar(100)  not null primary key,
      templatename         nvarchar(100),
      processguid          nvarchar(100),
      processversionguid   nvarchar(100),
      frompviguid          nvarchar(100),
      templatejson         text,
      templatexml          text,
      image         text,
      userguid      nvarchar(100),
      ouguid            nvarchar(100),
      baseouguid        nvarchar(100),
      templatetype      nvarchar(100),
      bak1      nvarchar(100),
      bak2      nvarchar(100),
      bak3      nvarchar(100)
    );
GO

-- 2019/07/06
-- 季海英
-- Workflow_Transition_Condition添加字段orderNum
if not exists (select name from syscolumns  where id = object_id('Workflow_Transition_Condition') and name='orderNum' )  
 alter table Workflow_Transition_Condition add orderNum  int; 
GO
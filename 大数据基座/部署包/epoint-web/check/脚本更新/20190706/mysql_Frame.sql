-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/5/15 
-- 季立霞
-- 添加自定义流程模板表
create table if not exists workflow_template
(
  templateguid         nvarchar(100) not null primary key,
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
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns  
            where table_schema = database() and table_name = 'Workflow_Transition_Condition' and column_name = 'orderNum') then  
    alter table Workflow_Transition_Condition add column orderNum int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --
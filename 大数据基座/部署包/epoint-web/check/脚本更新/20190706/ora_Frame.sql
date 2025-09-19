-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/5/15 
-- 季立霞

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_template');
 if (isexist = 0) then
    execute immediate '
      create table workflow_template
             (
               templateguid         nvarchar2(100) not null primary key,
               templatename         nvarchar2(100),
               processguid          nvarchar2(100),
               processversionguid   nvarchar2(100),
               frompviguid          nvarchar2(100),
               templatejson         CLOB,
               templatexml          CLOB,
               image         CLOB,
               userguid      nvarchar2(100),
               ouguid            nvarchar2(100),
               baseouguid        nvarchar2(100),
               templatetype      nvarchar2(100),
               bak1      nvarchar2(100),
               bak2      nvarchar2(100),
               bak3      nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */
-- 2019/07/06
-- 季海英
-- Workflow_Transition_Condition添加字段orderNum
begin 
  declare isexist number; 
  begin 
  select count(1) into isexist from user_tab_columns where table_name = upper('Workflow_Transition_Condition') and column_name = upper('orderNum'); 
  if (isexist = 0) then 
    execute immediate 'alter table Workflow_Transition_Condition add orderNum  integer';
  end if; 
  end; 
end; 
-- end;



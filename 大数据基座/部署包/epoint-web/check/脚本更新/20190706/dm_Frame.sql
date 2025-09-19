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
      CREATE TABLE WORKFLOW_TEMPLATE
             (
               TEMPLATEGUID         NVARCHAR2(100) NOT NULL PRIMARY KEY,
               TEMPLATENAME         NVARCHAR2(100),
               PROCESSGUID          NVARCHAR2(100),
               PROCESSVERSIONGUID   NVARCHAR2(100),
               FROMPVIGUID          NVARCHAR2(100),
               TEMPLATEJSON         CLOB,
               TEMPLATEXML          CLOB,
               IMAGE         CLOB,
               USERGUID      NVARCHAR2(100),
               OUGUID            NVARCHAR2(100),
               BASEOUGUID        NVARCHAR2(100),
               TEMPLATETYPE      NVARCHAR2(100),
               BAK1      NVARCHAR2(100),
               BAK2      NVARCHAR2(100),
               BAK3      NVARCHAR2(100)
              )';
  end if;
  end;
end;
/* GO */
-- 添加字段
drop procedure if exists`epoint_proc_alter`; 
GO 
create   procedure `epoint_proc_alter`() 
begin  
if not exists (select null from information_schema.columns 
            where table_schema = database() and table_name = 'Workflow_Transition_Condition' and column_name = 'orderNum') then 
    alter table Workflow_Transition_Condition add  orderNum nvarchar(100); 
end if; 
end; 
GO 
call epoint_proc_alter(); 
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- end;



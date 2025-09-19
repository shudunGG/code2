-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/06/03

-- Workflow_PVI_Material
begin
  declare isexist number;
  begin
   select count(1) into isexist from user_tab_columns where table_name = upper('Workflow_PVI_Material') and column_name = upper('clienttag') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table Workflow_PVI_Material add newcolumn NVARCHAR2(2000)';
    execute immediate 'update Workflow_PVI_Material set newcolumn = clienttag';
    execute immediate 'alter table Workflow_PVI_Material drop column clienttag';
    execute immediate 'alter table Workflow_PVI_Material rename column newColumn to clienttag';
  end if;
  end;
  end;
  /* GO */
  

-- end;
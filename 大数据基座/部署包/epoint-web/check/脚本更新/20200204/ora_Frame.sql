-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/02/04
-- 表单版本表中增加移动端设计数据字段 --【薛炳】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('mobiledesigndata');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add mobiledesigndata  CLOB';
  end if;
  end;
end;
/* GO */

-- epointsformtemplate表添加WorkflowDetailTemplateUrl
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtemplate') and column_name = upper('WorkflowDetailTemplateUrl');
  if (isexist = 0) then
    execute immediate 'alter table epointsformtemplate add WorkflowDetailTemplateUrl nvarchar2(100)';
  end if;
  end;
end;
/* GO */

 
-- end;



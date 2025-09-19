-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/02/10
-- 表单版本表中增加表单类型字段 --【薛炳】
 
-- Epointsform表添加formtype
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Epointsform') and column_name = upper('formtype');
  if (isexist = 0) then
    execute immediate 'alter table Epointsform add formtype nvarchar2(20)';
  end if;
  end;
end;
/* GO */

-- Epointsform表添加tablesource
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Epointsform') and column_name = upper('tablesource');
  if (isexist = 0) then
    execute immediate 'alter table Epointsform add tablesource nvarchar2(20)';
  end if;
  end;
end;
/* GO */

-- epointsform_tablerelation表添加sharefielddata
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_tablerelation') and column_name = upper('sharefielddata');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_tablerelation add sharefielddata CLOB';
  end if;
  end;
end;
/* GO */

 
-- end;



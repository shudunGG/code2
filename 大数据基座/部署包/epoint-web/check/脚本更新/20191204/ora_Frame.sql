-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/03 
--  在线表单tablebasicinfo表新增1个字段、tablestruct表新增4个字段 --【季立霞】

-- 表单基础信息表添加合并表单ids字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_basicinfo') and column_name = upper('mergeformids');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_basicinfo add mergeformids  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 添加手风琴代码项字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct') and column_name = upper('codeid');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_struct add codeid  Integer';
  end if;
  end;
end;
/* GO */


-- 添加所属栏目Id字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct') and column_name = upper('itemid');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_struct add itemid  Integer';
  end if;
  end;
end;
/* GO */


-- 添加所属栏目中顺序字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct') and column_name = upper('columnordernum');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_struct add columnordernum  Integer';
  end if;
  end;
end;
/* GO */


-- 添加合并前字段所属表字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct') and column_name = upper('beforetableid');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_struct add beforetableid  Integer';
  end if;
  end;
end;
/* GO */

-- end;



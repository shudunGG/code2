-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/20 
-- 修改原类型为text大字段无必要性的字段为nvarchar(2000) --季立霞

-- 修改epointsform_table_basicinfo中bak1字段类型
begin
 declare isexist number;
 begin
 select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_basicinfo') and column_name = upper('bak1') and data_type='NVARCHAR2' and data_length='4000';
 
 if (isexist = 0) then
    execute immediate 'alter table epointsform_table_basicinfo add newcolumn nvarchar2(2000)';
    execute immediate 'update epointsform_table_basicinfo set newcolumn = bak1';
    execute immediate 'alter table epointsform_table_basicinfo drop column bak1';
    execute immediate 'alter table epointsform_table_basicinfo rename column newColumn to bak1';
 end if;
 end;
end;
/* GO */

-- 修改epointsform_table_struct中bak1字段类型
begin
 declare isexist number;
 begin
 select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_struct') and column_name = upper('bak1') and data_type='NVARCHAR2' and data_length='4000';
 if (isexist = 0) then
    execute immediate 'alter table epointsform_table_struct add newcolumn nvarchar2(2000)';
    execute immediate 'update epointsform_table_struct set newcolumn = bak1';
    execute immediate 'alter table epointsform_table_struct drop column bak1';
    execute immediate 'alter table epointsform_table_struct rename column newColumn to bak1';
 end if;
 end;
end;
/* GO */

-- end;



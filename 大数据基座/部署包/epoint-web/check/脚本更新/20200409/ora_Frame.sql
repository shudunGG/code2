-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2020/04/09
-- 添加表frame_schemetableshow表 parenttableid字段 --陈端一
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemetableshow') and column_name = upper('parenttableid');
  if (isexist = 0) then
    execute immediate 'alter table frame_schemetableshow add parenttableid integer';
  end if;
  end;
end;
/* GO */

-- 修改typename字段类型为nvarchar2
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_method') and column_name = upper('typename') and data_type='NVARCHAR2';
  if (isexist = 0) then
     execute immediate 'alter table workflow_method add newcolumn nvarchar2(500)';
    execute immediate 'update workflow_method set newcolumn = typename';
    execute immediate 'alter table workflow_method drop column typename';
    execute immediate 'alter table workflow_method rename column newColumn to typename';
  end if;
  end;
end;

-- 修改methodname字段类型为nvarchar2
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_method') and column_name = upper('methodname') and data_type='NVARCHAR2';
  if (isexist = 0) then
     execute immediate 'alter table workflow_method add newcolumn nvarchar2(200)';
    execute immediate 'update workflow_method set newcolumn = methodname';
    execute immediate 'alter table workflow_method drop column methodname';
    execute immediate 'alter table workflow_method rename column newColumn to methodname';
  end if;
  end;
end;

-- end;



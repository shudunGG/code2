-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/05/20 
-- workflow_processversion表添加baseouguid --季晓伟
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_processversion') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_processversion add baseouguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- workflow_activity_operation表添加baseouguid --季晓伟
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_activity_operation') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_activity_operation add baseouguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- workflow_participator表添加baseouguid --季晓伟
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_participator') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_participator add baseouguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- workflow_event表添加baseouguid --季晓伟
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_event') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_event add baseouguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 2019/5/20
-- table_basicinfo、table_struct添加baseouguid字段 --【徐剑】

-- table_basicinfo添加baseouguid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add baseouguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- table_struct添加baseouguid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add baseouguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;

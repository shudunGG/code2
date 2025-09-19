-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/01/09
-- 角色信息增加appguid字段 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_role add appguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role_snapshot') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_role_snapshot add appguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_roletype') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_roletype add appguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_roletype_snapshot') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_roletype_snapshot add appguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */
-- end;



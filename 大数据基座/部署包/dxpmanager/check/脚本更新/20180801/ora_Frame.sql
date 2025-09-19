-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/01
-- frameMyAddressGroup、frame_myaddressgroup_snapshot添加appguid,isfilter字段,删除ouguids字段 --季立霞
-- frameMyAddressBook、frame_myaddressbook_snapshot添加row_id字段  --季立霞

-- 删除ouguids字段
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressGroup') and column_name = upper('ouguids');
  if (isexist = 1) then
    execute immediate 'alter table Frame_MyAddressGroup drop column ouguids';
  end if;
  end;
end;
/* GO */

-- 添加appguid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressGroup') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressGroup add  appguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 添加isfilter字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressGroup') and column_name = upper('isfilter');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressGroup add  isfilter nvarchar2(4)';
  end if;
  end;
end;
/* GO */

-- 添加row_id字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressBook') and column_name = upper('row_id');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressBook add  row_id INTEGER';
  end if;
  end;
end;
/* GO */



-- 快照删除ouguids字段
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressgroup_snapshot') and column_name = upper('ouguids');
  if (isexist = 1) then
    execute immediate 'alter table frame_myaddressgroup_snapshot drop column ouguids';
  end if;
  end;
end;
/* GO */

-- 快照添加appguid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressgroup_snapshot') and column_name = upper('appguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_myaddressgroup_snapshot add  appguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 快照添加isfilter字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressgroup_snapshot') and column_name = upper('isfilter');
  if (isexist = 0) then
    execute immediate 'alter table frame_myaddressgroup_snapshot add  isfilter nvarchar2(4)';
  end if;
  end;
end;
/* GO */

-- 快照添加row_id字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressbook_snapshot') and column_name = upper('row_id');
  if (isexist = 0) then
    execute immediate 'alter table frame_myaddressbook_snapshot add  row_id INTEGER';
  end if;
  end;
end;
/* GO */


-- end;



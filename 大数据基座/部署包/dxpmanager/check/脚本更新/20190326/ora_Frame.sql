-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/03/26 
-- 修改app_element中elementurl字段长度 -- 王颜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_element') and column_name = upper('elementurl') and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 1) then
    execute immediate 'alter table app_element modify elementurl nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- frame_userrole_snapshot表的row_id字段设置可为null--王露

begin
  declare isexist number;
  begin
  select count(1) into isexist from  user_tab_columns where table_name = upper('frame_userrole_snapshot') and column_name = upper('row_id') and nullable='N';
 if (isexist > 0) then
    execute immediate 'alter table frame_userrole_snapshot modify row_id number(10,0) null';
  end if;
  end;
end;
/* GO */

-- end;



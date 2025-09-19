-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('MD5ID');
  if (isexist = 0) then
    execute immediate 'alter table frame_user add  MD5ID NVARCHAR2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot') and column_name = upper('MD5ID');
  if (isexist = 0) then
    execute immediate 'alter table frame_user_snapshot add  MD5ID NVARCHAR2(50)';
  end if;

    
commit;
  
  end;
end;
/* GO */
  

-- end;
-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

/* GO */

-- frame_anti_tamper表新增 datatype、tableid、datamaskingtype字段，修改anticolumns长度--jyjie
 begin
  declare isexist number;
  begin
	  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_anti_tamper') and column_name = upper('datatype');
  if (isexist = 0) then
    execute immediate 'alter table frame_anti_tamper add datatype nvarchar2(50)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_anti_tamper') and column_name = upper('tableid');
  if (isexist = 0) then
    execute immediate 'alter table frame_anti_tamper add tableid integer';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_anti_tamper') and column_name = upper('datamaskingtype');
  if (isexist = 0) then
    execute immediate 'alter table frame_anti_tamper add datamaskingtype nvarchar2(500)';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_anti_tamper') and column_name = upper('anticolumns') and data_type='NVARCHAR2' and data_length='50';
  if (isexist = 1) then
    execute immediate 'alter table frame_anti_tamper modify anticolumns nvarchar2(500)';
  end if;
  
  end;
end;

-- end;



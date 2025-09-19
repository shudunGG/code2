-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/07/05 
-- 修改frame_log中content字段长度 -- cdy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log') and column_name = upper('content') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
    execute immediate 'alter table frame_log modify content nvarchar2(2000)';
  end if;
  end;
end;
/* GO */



-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/05/15
-- 修改frame_exttabsconfig中exturl字段长度 -- hexy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_exttabsconfig') and column_name = upper('exturl') and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
    execute immediate 'alter table frame_exttabsconfig modify exturl nvarchar2(200)';
  end if;
  end;
end;
/* GO */
--end;
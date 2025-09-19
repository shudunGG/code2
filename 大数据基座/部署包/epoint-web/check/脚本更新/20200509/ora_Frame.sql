-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/5/9
-- 修改分库分表的表字段shardingrule的长度 --wy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_sharding') and column_name = upper('shardingrule') and data_type='NVARCHAR2' and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table frame_sharding modify shardingrule nvarchar2(1000)';
  end if;
  end;
end;
/* GO */
-- end;



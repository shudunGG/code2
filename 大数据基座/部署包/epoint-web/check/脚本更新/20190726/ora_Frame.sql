-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/26【时间】
-- frame_lessee表新增datasourceGuid字段长度-- 孟佳佳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lessee') and column_name = upper('datasourceguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_lessee add datasourceguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/6/8 
-- 系统参数添加字段isrestjsboot --周志豪

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_config') and column_name = upper('isrestjsboot');
  if (isexist = 0) then
    execute immediate 'alter table frame_config add isrestjsboot  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;



-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/4/23

-- 扩展控件信息表extendfieldtwo字段修改长度  --季立霞
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_extensible_control') and column_name = upper('extendfieldtwo');
  if (isexist = 1) then
    execute immediate 'alter table epointsform_extensible_control modify extendfieldtwo nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- end;


